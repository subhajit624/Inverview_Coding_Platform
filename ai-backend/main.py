from dotenv import load_dotenv

load_dotenv()
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.resume import router as resume_router
from routers.interview import router as interview_router


app = FastAPI(title="CrackIt AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_router, prefix="/api/resume", tags=["resume"])
app.include_router(interview_router, prefix="/interview", tags=["interview"])


@app.get("/")
async def health_check() -> dict[str, str]:
    return {"status": "AI backend running"}


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))  
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
