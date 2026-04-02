import os
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url

_IS_CONFIGURED = False


def _configure_cloudinary() -> None:
    global _IS_CONFIGURED
    if _IS_CONFIGURED:
        return

    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
    api_key = os.getenv("CLOUDINARY_API_KEY")
    api_secret = os.getenv("CLOUDINARY_API_SECRET")

    if not cloud_name or not api_key or not api_secret:
        raise RuntimeError("Cloudinary credentials are missing in environment variables.")

    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret,
        secure=True,
    )
    _IS_CONFIGURED = True


def upload_resume_to_cloudinary(file_bytes: bytes, filename: str) -> str:
    _configure_cloudinary()

    cloudinary.uploader.upload(
        file=file_bytes,
        folder="crackit/resumes",
        public_id=filename,
        resource_type="raw",
        type="upload",
        overwrite=True,
    )

    signed_url, _ = cloudinary_url(
        f"crackit/resumes/{filename}",
        resource_type="raw",
        type="upload",
        sign_url=True,
        secure=True,
    )

    if not signed_url:
        raise RuntimeError("Failed to generate signed URL for the uploaded resume.")

    return signed_url