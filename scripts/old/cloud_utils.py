"""
Cloud service utilities for Reddit scraper
"""

from typing import Optional

# --- PLACEHOLDER CONFIGURATION ---
# Replace these with your actual credentials when using this script

# Cloudinary Configuration (for image hosting)
CLOUDINARY_CLOUD_NAME = "your_cloud_name"         # Your Cloudinary cloud name
CLOUDINARY_API_KEY = "your_api_key"               # Your Cloudinary API key
CLOUDINARY_API_SECRET = "your_api_secret"         # Your Cloudinary API secret

def upload_to_cloudinary(image_url: str, post_id: str) -> Optional[str]:
    """
    Example function to upload images to Cloudinary.
    In a real implementation, you would configure Cloudinary here.
    """
    if not image_url or "v.redd.it" in image_url:  # Skip if video
        return None

    try:
        print(f"     Uploading to Cloudinary (example)...")

        # In a real implementation, you would use:
        # cloudinary.config(
        #   cloud_name = CLOUDINARY_CLOUD_NAME,
        #   api_key = CLOUDINARY_API_KEY,
        #   api_secret = CLOUDINARY_API_SECRET,
        #   secure = True
        # )
        # response = cloudinary.uploader.upload(...)

        # This is just an example - return a placeholder URL
        return f"https://res.cloudinary.com/{CLOUDINARY_CLOUD_NAME}/image/upload/coc_bases/{post_id}"

    except Exception as e:
        print(f"    Cloudinary Upload Failed (example): {e}")
        return None