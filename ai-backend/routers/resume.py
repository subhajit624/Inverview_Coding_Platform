from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from models.schemas import ResumeAnalysisResponse
from services.cloudinary_service import upload_resume_to_cloudinary
from services.resume_analyzer import run_resume_analysis


router = APIRouter()


@router.post("/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume(
    file: UploadFile = File(...),
    job_role: str = Form(...),
    job_description: str | None = Form(None),
):
    filename = file.filename or "resume.pdf"

    if file.content_type != "application/pdf" and not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed.",
        )

    if not job_role or not job_role.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="job_role is required.",
        )

    try:
        pdf_bytes = await file.read()
        if not pdf_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty.",
            )

        cloudinary_url = upload_resume_to_cloudinary(pdf_bytes, filename)
        analysis_result = await run_resume_analysis(
            pdf_bytes=pdf_bytes,
            job_role=job_role.strip(),
            job_description=job_description,
        )

        if analysis_result.get("error"):
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=analysis_result,
            )

        response_payload = {
            "cloudinary_url": cloudinary_url,
            **analysis_result,
        }
        return ResumeAnalysisResponse(**response_payload)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze resume: {exc}",
        ) from exc
