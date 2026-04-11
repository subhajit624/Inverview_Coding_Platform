import io
import os
import re

import pdfplumber
from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_mongodb import MongoDBAtlasVectorSearch
from pydantic import BaseModel, Field
from pymongo import MongoClient


router = APIRouter()

DB_NAME = "rag_db"
COLLECTION_NAME = "notes_chunks"
VECTOR_INDEX_NAME = "vector_index"


class AskNotesRequest(BaseModel):
    question: str = Field(min_length=1)
    userId: str = Field(min_length=1)
    noteId: str = Field(min_length=1)


def get_collection():
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        raise RuntimeError("MONGO_URI is missing in ai-backend .env")

    client = MongoClient(mongo_uri)
    return client, client[DB_NAME][COLLECTION_NAME]


def extract_pdf_text(file_bytes: bytes) -> str:
    text_parts: list[str] = []

    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            text_parts.append(page.extract_text() or "")

    text = "\n".join(text_parts).strip()
    if not text:
        raise ValueError("No readable text found in the uploaded PDF.")

    return text


def rank_chunks_for_question(
    chunks: list[str],
    question: str,
    limit: int = 4,
) -> list[str]:
    if not chunks:
        return []

    terms = [token for token in re.findall(r"[a-zA-Z0-9]+", question.lower()) if len(token) > 2]
    if not terms:
        return chunks[:limit]

    scored_chunks: list[tuple[int, str]] = []
    for chunk in chunks:
        lowered = chunk.lower()
        score = sum(lowered.count(term) for term in terms)
        scored_chunks.append((score, chunk))

    scored_chunks.sort(key=lambda item: item[0], reverse=True)
    matched = [chunk for score, chunk in scored_chunks if score > 0]
    if matched:
        return matched[:limit]

    return chunks[:limit]


def load_chunks_from_db(
    collection,
    user_id: str,
    note_id: str,
    question: str,
    limit: int = 4,
) -> list[str]:
    note_chunks = [
        (doc.get("text") or "").strip()
        for doc in collection.find(
            {
                "user_id": user_id,
                "note_id": note_id,
            },
            {"text": 1},
        ).limit(200)
    ]
    note_chunks = [chunk for chunk in note_chunks if chunk]
    if note_chunks:
        return rank_chunks_for_question(note_chunks, question, limit)

    # Backward compatibility for legacy chunks that do not have note_id.
    user_chunks = [
        (doc.get("text") or "").strip()
        for doc in collection.find(
            {"user_id": user_id},
            {"text": 1},
        ).limit(200)
    ]
    user_chunks = [chunk for chunk in user_chunks if chunk]
    return rank_chunks_for_question(user_chunks, question, limit)


@router.post("/upload-notes")
async def upload_notes(
    file: UploadFile = File(...),
    userId: str = Form(...),
    noteId: str = Form(...),
) -> dict[str, bool]:
    user_id = userId.strip()
    note_id = noteId.strip()

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="userId is required.",
        )

    if not note_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="noteId is required.",
        )

    file_name = (file.filename or "").lower()
    is_pdf = file.content_type == "application/pdf" or file_name.endswith(".pdf")
    if not is_pdf:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported.",
        )

    try:
        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty.",
            )

        full_text = extract_pdf_text(file_bytes)
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = splitter.split_text(full_text)

        if not chunks:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not split PDF into chunks.",
            )

        documents = [
            Document(
                page_content=chunk,
                metadata={
                    "user_id": user_id,
                    "note_id": note_id,
                },
            )
            for chunk in chunks
        ]

        embeddings = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-2-preview",
            google_api_key=os.getenv("GEMINI_API_KEY"),
        )

        client, collection = get_collection()
        try:
            collection.delete_many({"user_id": user_id, "note_id": note_id})

            MongoDBAtlasVectorSearch.from_documents(
                documents=documents,
                embedding=embeddings,
                collection=collection,
                index_name=VECTOR_INDEX_NAME,
            )
        finally:
            client.close()

        return {"success": True}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload notes: {exc}",
        ) from exc


@router.post("/ask-notes")
async def ask_notes(payload: AskNotesRequest) -> dict[str, str]:
    question = payload.question.strip()
    user_id = payload.userId.strip()
    note_id = payload.noteId.strip()

    if not question:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="question is required.",
        )

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="userId is required.",
        )

    if not note_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="noteId is required.",
        )

    try:
        embeddings = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-2-preview",
            google_api_key=os.getenv("GEMINI_API_KEY"),
        )

        client, collection = get_collection()
        try:
            vector_store = MongoDBAtlasVectorSearch(
                collection=collection,
                embedding=embeddings,
                index_name=VECTOR_INDEX_NAME,
            )

            docs: list[Document] = []
            try:
                docs = vector_store.similarity_search(
                    query=question,
                    k=4,
                    pre_filter={
                        "user_id": {"$eq": user_id},
                        "note_id": {"$eq": note_id},
                    },
                )

                # Backward compatibility for old chunks that were indexed without note_id.
                if not docs:
                    docs = vector_store.similarity_search(
                        query=question,
                        k=4,
                        pre_filter={"user_id": {"$eq": user_id}},
                    )
            except Exception:
                docs = []

            context_chunks = [doc.page_content for doc in docs if doc.page_content]
            if not context_chunks:
                context_chunks = load_chunks_from_db(
                    collection=collection,
                    user_id=user_id,
                    note_id=note_id,
                    question=question,
                    limit=4,
                )
        finally:
            client.close()

        if not context_chunks:
            return {"answer": "I could not find this in your notes."}

        context = "\n\n".join(context_chunks)

        prompt = f"""
    You are a helpful notes assistant.
    Use the context below to answer clearly.
    If the answer is not present in the context, reply exactly: I could not find this in your notes.

    Context:
    {context}

    Question:
    {question}
    """.strip()

        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash-lite",
            temperature=0.2,
            google_api_key=os.getenv("GEMINI_API_KEY"),
        )

        result = llm.invoke(prompt)

        answer = str(result.content).strip() if result else ""
        if not answer:
            answer = "I could not find this in your notes."

        return {"answer": answer}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to ask notes: {exc}",
        ) from exc