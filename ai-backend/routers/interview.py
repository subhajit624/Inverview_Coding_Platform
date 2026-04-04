import json
import os
import re

from fastapi import APIRouter, HTTPException, status
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_groq import ChatGroq
from pydantic import BaseModel, Field


router = APIRouter()

llm = ChatGroq(
    model="openai/gpt-oss-20b",
    groq_api_key=os.getenv("GROQ_API_KEY"),
)


class ConversationItem(BaseModel):
    role: str
    content: str


class StartInterviewRequest(BaseModel):
    role: str = Field(min_length=1)
    level: str = "mid"


class RespondInterviewRequest(BaseModel):
    role: str = Field(min_length=1)
    level: str = "mid"
    conversation: list[ConversationItem]


class EndInterviewRequest(BaseModel):
    conversation: list[ConversationItem]


def _extract_json_payload(raw_content: str) -> dict:
    cleaned = raw_content.strip()

    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?", "", cleaned, flags=re.IGNORECASE).strip()
        cleaned = re.sub(r"```$", "", cleaned).strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, flags=re.DOTALL)
        if not match:
            raise
        return json.loads(match.group(0))


def _as_text(content: object) -> str:
    if isinstance(content, str):
        return content
    return str(content)


@router.post("/start")
async def start_interview(payload: StartInterviewRequest) -> dict[str, str]:
    try:
        messages = [
            SystemMessage(
                content=(
                    "You are a strict but fair technical interviewer. "
                    f"You are interviewing a {payload.level} level {payload.role} candidate. "
                    "Ask one question at a time. Start with a warm intro question. "
                    "Reply with only the question, no extra text."
                )
            ),
            HumanMessage(content="Start the interview."),
        ]

        response = llm.invoke(messages)
        question = _as_text(response.content).strip()

        if not question:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Model returned an empty question.",
            )

        return {"question": question}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start interview: {exc}",
        ) from exc


@router.post("/respond")
async def respond_interview(payload: RespondInterviewRequest) -> dict[str, object]:
    try:
        messages = [
            SystemMessage(
                content=(
                    f"You are interviewing a {payload.level} level {payload.role} candidate. "
                    "Score the last user answer out of 10, give brief feedback, "
                    "then ask the next interview question. "
                    "After 8 user answers set isLast to true. "
                    "Reply ONLY in this exact JSON format, no markdown, no extra text: "
                    '{ "score": number, "feedback": string, "nextQuestion": string, "isLast": boolean }'
                )
            )
        ]

        for item in payload.conversation:
            if item.role == "ai":
                messages.append(AIMessage(content=item.content))
            else:
                messages.append(HumanMessage(content=item.content))

        response = llm.invoke(messages)

        try:
            parsed = _extract_json_payload(_as_text(response.content))
        except json.JSONDecodeError as decode_error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Failed to parse model JSON response: {decode_error}",
            ) from decode_error

        score = max(0.0, min(10.0, float(parsed.get("score", 0))))
        feedback = str(parsed.get("feedback", "")).strip() or "Feedback unavailable."
        next_question = str(parsed.get("nextQuestion", "")).strip()
        is_last = bool(parsed.get("isLast", False))

        user_answers = sum(1 for item in payload.conversation if item.role == "user")
        if user_answers >= 8:
            is_last = True

        if not is_last and not next_question:
            next_question = "Can you share another concrete example from your experience?"

        return {
            "score": round(score, 2),
            "feedback": feedback,
            "nextQuestion": next_question,
            "isLast": is_last,
        }
    except HTTPException:
        raise
    except ValueError as value_error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Model response had invalid value types: {value_error}",
        ) from value_error
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process interview response: {exc}",
        ) from exc


@router.post("/end")
async def end_interview(payload: EndInterviewRequest) -> dict[str, object]:
    try:
        messages = [
            SystemMessage(
                content=(
                    "Based on this interview conversation give overall feedback "
                    "and an overall score out of 10. "
                    "Reply ONLY in this exact JSON format, no markdown, no extra text: "
                    '{ "overallFeedback": string, "overallScore": number }'
                )
            ),
            HumanMessage(content="Here is the full conversation: " + str([item.model_dump() for item in payload.conversation])),
        ]

        response = llm.invoke(messages)

        try:
            parsed = _extract_json_payload(_as_text(response.content))
        except json.JSONDecodeError as decode_error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Failed to parse model JSON response: {decode_error}",
            ) from decode_error

        overall_feedback = (
            str(parsed.get("overallFeedback", "")).strip()
            or "Overall feedback unavailable."
        )
        overall_score = max(0.0, min(10.0, float(parsed.get("overallScore", 0))))

        return {
            "overallFeedback": overall_feedback,
            "overallScore": round(overall_score, 2),
        }
    except HTTPException:
        raise
    except ValueError as value_error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Model response had invalid value types: {value_error}",
        ) from value_error
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to end interview: {exc}",
        ) from exc
