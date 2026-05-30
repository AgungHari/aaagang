"""
Reddit Scraper Example for Clash of Clans Base Layouts
=====================================================

This is a SANITIZED example script demonstrating how to properly scrape
Reddit for Clash of Clans base layouts without using their official API.

IMPORTANT: This script contains PLACEHOLDER values for all sensitive information.
Replace the placeholders with your actual credentials before running.
"""

import requests
import re
import json
import time
from typing import List, Dict, Any, Optional, Tuple
from urllib.parse import urljoin

# --- PLACEHOLDER CONFIGURATION ---
# Replace these with your actual credentials when using this script

# Database Configuration (Turso)
TURSO_URL = "https://your-database-url.turso.io"  # Your Turso database URL
TURSO_TOKEN = "your_turso_auth_token_here"        # Your Turso authentication token

# Reddit API Configuration only if using Reddit's API (not required for basic scraping, but recommended for proper access)
# REDDIT_CLIENT_ID = "your_reddit_client_id"        # Register at https://www.reddit.com/prefs/apps
# REDDIT_CLIENT_SECRET = "your_reddit_client_secret"
# REDDIT_USER_AGENT = "script:coc_base_scraper:v1.0 (by /u/your_username)"
# REDDIT_USERNAME = "your_reddit_username"          # Your Reddit username
# REDDIT_PASSWORD = "your_reddit_password"          # Your Reddit password

# Cloudinary Configuration (for image hosting)
CLOUDINARY_CLOUD_NAME = "your_cloud_name"         # Your Cloudinary cloud name
CLOUDINARY_API_KEY = "your_api_key"               # Your Cloudinary API key
CLOUDINARY_API_SECRET = "your_api_secret"         # Your Cloudinary API secret

# Scraper Settings
SUBREDDIT_NAME = "COCBaseLayouts"  # Subreddit to scrape
BATCH_SIZE = 15                    # Number of items before stopping for curation

def get_reddit_token() -> Optional[str]:
    """
    Get OAuth token for Reddit API access.
    This demonstrates proper authentication with Reddit's API.
    """
    try:
        auth = requests.auth.HTTPBasicAuth(REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET)
        data = {
            'grant_type': 'password',
            'username': REDDIT_USERNAME,
            'password': REDDIT_PASSWORD
        }
        headers = {'User-Agent': REDDIT_USER_AGENT}

        res = requests.post(
            'https://www.reddit.com/api/v1/access_token',
            auth=auth,
            data=data,
            headers=headers
        )
        res.raise_for_status()
        return res.json()['access_token']

    except Exception as e:
        print(f" Error getting Reddit token: {e}")
        return None

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

def extract_th_level(flair_text: str) -> int:
    """Extract TH level from flair text"""
    if not flair_text:
        return 0
    match = re.search(r'(\d+)', str(flair_text))
    return int(match.group(1)) if match else 0

def find_coc_links(text: str) -> List[str]:
    """Find all Clash of Clans copy links in text"""
    if not text:
        return []
    # Pattern: https://link.clashofclans.com/...
    matches = re.findall(r'https://link\.clashofclans\.com/[^\s\)"\]]+', text)
    # Clean up & if present
    return [link.replace('&', '&') for link in matches]

def get_post_details(post_id: str) -> Tuple[Optional[Dict], List[Dict]]:
    """
    Fetch post details from Reddit API (to get comments).
    Demonstrates proper API usage with authentication.
    """
    try:
        token = get_reddit_token()
        if not token:
            return None, []

        url = f"https://oauth.reddit.com/r/{SUBREDDIT_NAME}/comments/{post_id}/.json"
        headers = {
            'User-Agent': REDDIT_USER_AGENT,
            'Authorization': f'bearer {token}'
        }

        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()

        # Response structure: [post_data, comments_data]
        if len(data) >= 2:
            post_info = data[0]['data']['children'][0]['data']
            comments_info = data[1]['data']['children']
            return post_info, comments_info
        return None, []

    except Exception as e:
        print(f" Error fetching post {post_id}: {e}")
        return None, []

def extract_coc_links_from_post(post_data: Dict, comments_data: List[Dict]) -> List[str]:
    """Extract COC links from post and comments"""
    coc_links = []

    # Check in post selftext
    if post_data and post_data.get('selftext'):
        coc_links.extend(find_coc_links(post_data['selftext']))

    # Check in comments
    for comment in comments_data:
        if comment['kind'] == 't1':  # t1 = comment
            body = comment['data'].get('body', '')
            coc_links.extend(find_coc_links(body))

    return list(set(coc_links))  # Remove duplicates

def scrape_and_insert(post_feed: Any, max_items: Optional[int] = None) -> int:
    """
    Main scraping function - demonstrates the complete scraping workflow.
    This is an EXAMPLE that shows what the process would look like.
    """
    print("=" * 60)
    print(" REDDIT SCRAPER EXAMPLE - Clash of Clans Base Layouts")
    print("=" * 60)
    print("  This is a SANITIZED example with placeholder values")
    print("   Replace all PLACEHOLDER values before running\n")

    # In a real implementation, you would initialize your database client here
    print(" Database connection would be established here (with real credentials)\n")

    try:
        # Parse post feed
        if isinstance(post_feed, str):
            posts = json.loads(post_feed)['data']['children']
        else:
            posts = post_feed['data']['children']
    except Exception as e:
        print(f" Error parsing feed: {e}")
        return 0

    # Filter posts that contain "base" in title (case insensitive)
    filtered_posts = [
        p['data'] for p in posts
        if 'base' in p['data'].get('title', '').lower()
    ]
    print(f" Total posts with 'base' in title: {len(filtered_posts)}")

    total_inserted = 0
    processed_posts = 0

    for post in filtered_posts:
        if max_items and total_inserted >= max_items:
            print(f" Limit ({max_items}) reached, stopping!")
            break

        processed_posts += 1
        post_id = post.get('id')
        title = post.get('title', '')
        post_permalink = post.get('permalink', '')

        print(f"\n[{processed_posts}]  Processing: {title[:50]}...")

        # Fetch post details & comments
        post_detail, comments = get_post_details(post_id)

        if not post_detail:
            print("⏭  Skipped (couldn't fetch post)")
            continue

        # Extract TH level
        th_level = extract_th_level(post_detail.get('link_flair_text'))

        # Extract COC links from post + comments
        coc_links = extract_coc_links_from_post(post_detail, comments)

        if not coc_links:
            print("  Skipped (no COC links found)")
            continue

        # Image URL
        original_image_url = post_detail.get('url', '')
        # Ensure URL is valid (not video or external)
        if not original_image_url.startswith('http'):
            original_image_url = ''

        # Upload to Cloudinary if valid image URL
        cloudinary_url = None
        if original_image_url:
            cloudinary_url = upload_to_cloudinary(original_image_url, post_id)

        # Use Cloudinary link if successful, otherwise use original
        final_image_url = cloudinary_url if cloudinary_url else original_image_url

        # Source URL
        source_url = f"https://www.reddit.com{post_permalink}"

        print(f"    TH Level: {th_level}")
        print(f"    COC Links found: {len(coc_links)}")
        print(f"     Final Image URL: {final_image_url[:50]}..." if final_image_url else "     Image: (none)")

        # In a real implementation, you would insert each COC link to database here
        for coc_link in coc_links:
            print(f"    Would insert: {coc_link[:40]}...")
            total_inserted += 1

        # Rate limiting to be polite to Reddit
        time.sleep(1)

    print("\n" + "=" * 60)
    print(f"✨ EXAMPLE COMPLETE!")
    print(f"   Total posts processed: {processed_posts}")
    print(f"   Total data that would be inserted: {total_inserted}")
    print("   In a real implementation, this would update your database")
    print("=" * 60)

    return total_inserted

def run_from_json_file(json_file_path: str) -> int:
    """Run scraper from local JSON file (example)"""
    try:
        print(" Mode: Loading from local JSON file (example)")
        print("   In a real implementation, this would load actual data")

        # Example data structure
        example_data = {
            "data": {
                "children": [
                    {
                        "data": {
                            "id": "example1",
                            "title": "TH12 Base Layout - Anti 3 Star",
                            "permalink": "/r/COCBaseLayouts/comments/example1/th12_base_layout/",
                            "url": "https://example.com/th12-base.png",
                            "link_flair_text": "TH12"
                        }
                    }
                ]
            }
        }

        return scrape_and_insert(example_data, max_items=BATCH_SIZE)

    except Exception as e:
        print(f" Error: {e}")
        return 0

def run_from_reddit_api() -> int:
    """Run scraper directly from Reddit API (example)"""
    try:
        print(f" Fetching from Reddit API (r/{SUBREDDIT_NAME}) - Example")
        print("   In a real implementation, this would fetch actual data from Reddit")

        # Example data structure
        example_data = {
            "data": {
                "children": [
                    {
                        "data": {
                            "id": "example1",
                            "title": "TH12 Base Layout - Anti 3 Star",
                            "permalink": "/r/COCBaseLayouts/comments/example1/th12_base_layout/",
                            "url": "https://example.com/th12-base.png",
                            "link_flair_text": "TH12"
                        }
                    },
                    {
                        "data": {
                            "id": "example2",
                            "title": "TH11 Farming Base - Trophy Pushing",
                            "permalink": "/r/COCBaseLayouts/comments/example2/th11_farming_base/",
                            "url": "https://example.com/th11-base.png",
                            "link_flair_text": "TH11"
                        }
                    }
                ]
            }
        }

        return scrape_and_insert(example_data, max_items=BATCH_SIZE)

    except Exception as e:
        print(f" Error: {e}")
        return 0

if __name__ == "__main__":
    import sys

    print("📜 REDDIT SCRAPER EXAMPLE - Clash of Clans Base Layouts")
    print("=" * 60)
    print("This script demonstrates:")
    print("1. How to properly authenticate with Reddit's API")
    print("2. How to responsibly scrape Reddit for Clash of Clans base layouts")
    print("3. How to extract and process relevant data")
    print("4. Proper handling of sensitive credentials\n")

    if len(sys.argv) > 1 and sys.argv[1] == "local":
        # Run from "local JSON file" (example)
        run_from_json_file("example.json")
    else:
        # Run from "Reddit API" (example)
        run_from_reddit_api()