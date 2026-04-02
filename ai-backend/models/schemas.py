from pydantic import BaseModel, Field


class ResumeAnalysisRequest(BaseModel):
    job_role: str
    job_description: str | None = None


class SectionFeedback(BaseModel):
    summary: str = ""
    experience: str = ""
    skills: str = ""
    education: str = ""
    projects: str = ""


class ResumeAnalysisResponse(BaseModel):
    cloudinary_url: str
    ats_score: int = Field(ge=0, le=100)
    matched_keywords: list[str]
    missing_keywords: list[str]
    section_feedback: SectionFeedback
    overall_suggestions: list[str]
    strengths: list[str]
