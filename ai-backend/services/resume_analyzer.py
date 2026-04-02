import json
import os
import re
from typing import Any

import fitz
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import END, StateGraph
from typing_extensions import TypedDict


class ResumeAnalysisState(TypedDict):
    pdf_bytes: bytes
    job_role: str
    job_description: str | None
    extracted_text: str
    analysis_result: dict[str, Any]


def _extract_pdf_text(pdf_bytes: bytes) -> str:
    try:
        with fitz.open(stream=pdf_bytes, filetype="pdf") as document:
            full_text = "\n".join(page.get_text("text") for page in document)
    except Exception as exc:
        raise ValueError(f"Unable to extract text from PDF: {exc}") from exc

    cleaned_text = re.sub(r"[ \t]+", " ", full_text)
    cleaned_text = re.sub(r"\n{3,}", "\n\n", cleaned_text).strip()

    if not cleaned_text:
        raise ValueError("No readable text found in the uploaded PDF.")

    return cleaned_text


def _safe_parse_json(content: str) -> dict[str, Any]:
    text = content.strip()

    parse_candidates = [text]
    json_block_match = re.search(r"\{[\s\S]*\}", text)
    if json_block_match:
        parse_candidates.append(json_block_match.group(0))

    for candidate in parse_candidates:
        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            continue

    return {
        "error": "Failed to parse Gemini response as valid JSON.",
        "raw_response": text[:5000],
    }


def _get_response_text(response_content: Any) -> str:
    if isinstance(response_content, str):
        return response_content

    if isinstance(response_content, list):
        chunks: list[str] = []
        for block in response_content:
            if isinstance(block, dict):
                if "text" in block:
                    chunks.append(str(block["text"]))
            else:
                chunks.append(str(block))
        return "".join(chunks)

    return str(response_content)


def _build_analysis_prompt(extracted_text: str, job_role: str, job_description: str | None) -> str:
    job_description_text = job_description.strip() if job_description else "Not provided"

    return f"""
You are an ATS resume analyzer.
Analyze the resume against the target role and optionally job description.
Return ONLY raw JSON.
Do not include markdown, code fences, backticks, explanations, or extra text.

Use this exact JSON structure:
{{
  "ats_score": <integer 0-100>,
  "matched_keywords": ["keyword1", "keyword2"],
  "missing_keywords": ["keyword1", "keyword2"],
  "section_feedback": {{
    "summary": "feedback string",
    "experience": "feedback string",
    "skills": "feedback string",
    "education": "feedback string",
    "projects": "feedback string"
  }},
  "overall_suggestions": ["suggestion1", "suggestion2"],
  "strengths": ["strength1", "strength2"]
}}

Target Job Role:
{job_role}

Target Job Description:
{job_description_text}

Resume Text:
{extracted_text}
""".strip()


async def extract_text_node(state: ResumeAnalysisState) -> dict[str, Any]:
    extracted_text = _extract_pdf_text(state["pdf_bytes"])
    return {"extracted_text": extracted_text}


async def analyze_resume_node(state: ResumeAnalysisState) -> dict[str, Any]:
    try:
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not gemini_api_key:
            return {"analysis_result": {"error": "GEMINI_API_KEY is not set."}}

        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.2,
            google_api_key=gemini_api_key,
        )

        prompt = _build_analysis_prompt(
            extracted_text=state["extracted_text"],
            job_role=state["job_role"],
            job_description=state.get("job_description"),
        )

        response = await llm.ainvoke(prompt)
        raw_response_text = _get_response_text(response.content)
        parsed_response = _safe_parse_json(raw_response_text)

        return {"analysis_result": parsed_response}
    except Exception as exc:
        return {
            "analysis_result": {
                "error": "Resume analysis failed.",
                "details": str(exc),
            }
        }


_graph_builder = StateGraph(ResumeAnalysisState)
_graph_builder.add_node("extract_text", extract_text_node)
_graph_builder.add_node("analyze_resume", analyze_resume_node)
_graph_builder.set_entry_point("extract_text")
_graph_builder.add_edge("extract_text", "analyze_resume")
_graph_builder.add_edge("analyze_resume", END)
resume_analysis_graph = _graph_builder.compile()


async def run_resume_analysis(
    pdf_bytes: bytes,
    job_role: str,
    job_description: str | None,
) -> dict[str, Any]:
    initial_state: ResumeAnalysisState = {
        "pdf_bytes": pdf_bytes,
        "job_role": job_role,
        "job_description": job_description,
        "extracted_text": "",
        "analysis_result": {},
    }

    final_state = await resume_analysis_graph.ainvoke(initial_state)
    return final_state.get("analysis_result", {"error": "No analysis result was generated."})
