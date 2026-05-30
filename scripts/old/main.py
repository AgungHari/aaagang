"""
Reddit Scraper Example for Clash of Clans Base Layouts
=====================================================

This is a SANITIZED example script demonstrating how to properly scrape
Reddit for Clash of Clans base layouts without using their official API.

IMPORTANT: This script contains PLACEHOLDER values for all sensitive information.
Replace the placeholders with your actual credentials before running.
"""

import json
import time
from typing import List, Dict, Any, Optional

# Import local modules
from .auth_utils import get_reddit_token, REDDIT_USER_AGENT
from .scraper_utils import (
    extract_th_level,
    find_coc_links,
    get_post_details,
    extract_coc_links_from_post
)
from .cloud_utils import upload_to_cloudinary

# --- PLACEHOLDER CONFIGURATION ---
# Replace these with your actual credentials when using this script

# Database Configuration (Turso)
TURSO_URL = "https://your-database-url.turso.io"  # Your Turso database URL
TURSO_TOKEN = "your_turso_auth_token_here"        # Your Turso authentication token

# Scraper Settings
SUBREDDIT_NAME = "COCBaseLayouts"  # Subreddit to scrape
BATCH_SIZE = 15                    # Number of items before stopping for curation

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