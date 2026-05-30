"""
COC Base Analyzer & Reddit Scraper Example
=========================================

This is a SANITIZED example script demonstrating:
How to analyze Clash of Clans base layouts using AI (Gemini API)

IMPORTANT: This script contains PLACEHOLDER values for all sensitive information.
Replace the placeholders with your actual credentials before running.
"""

import requests
import time
import os
from typing import Optional, List, Dict, Any
from PIL import Image
from io import BytesIO

# --- PLACEHOLDER CONFIGURATION ---
# Replace these with your actual credentials when using this script
TURSO_URL = "https://your-database-url.turso.io"  # Your Turso database URL
TURSO_TOKEN = "your_turso_auth_token_here"        # Your Turso authentication token
GEMINI_API_KEY = "your_gemini_api_key_here"       # Your Google Gemini API key

# For Reddit API (register at https://www.reddit.com/prefs/apps)
# REDDIT_CLIENT_ID = "your_reddit_client_id"
# REDDIT_CLIENT_SECRET = "your_reddit_client_secret"
# REDDIT_USER_AGENT = "script:coc_analyzer:v1.0 (by /u/your_username)"

# --- REDDIT SCRAPER EXAMPLE (if you have credentials) ---
def get_reddit_posts(subreddit: str = "ClashOfClans", limit: int = 10) -> List[Dict[str, Any]]:
    """
    Example of LEGITIMATE Reddit scraping using the official API.

    Steps to use:
    1. Go to https://www.reddit.com/prefs/apps
    2. Create a "script" type application
    3. Fill in the credentials above
    4. Use the API responsibly (follow rate limits)
    """
    try:
        print(f"🔍 Fetching posts from r/{subreddit}...")

        # Authenticate with Reddit API
        auth = requests.auth.HTTPBasicAuth(REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET)
        data = {
            'grant_type': 'password',
            'username': 'your_reddit_username',  # Replace with your Reddit username
            'password': 'your_reddit_password'   # Replace with your Reddit password
        }

        headers = {'User-Agent': REDDIT_USER_AGENT}

        # Get OAuth token
        res = requests.post(
            'https://www.reddit.com/api/v1/access_token',
            auth=auth,
            data=data,
            headers=headers
        )
        res.raise_for_status()
        token = res.json()['access_token']

        # Fetch posts
        headers = {**headers, 'Authorization': f'bearer {token}'}
        params = {'limit': limit, 't': 'week'}  # Top posts from the past week

        res = requests.get(
            f'https://oauth.reddit.com/r/{subreddit}/top',
            headers=headers,
            params=params
        )
        res.raise_for_status()

        posts = []
        for post in res.json()['data']['children']:
            post_data = post['data']
            posts.append({
                'title': post_data['title'],
                'url': post_data['url'],
                'score': post_data['score'],
                'num_comments': post_data['num_comments'],
                'created_utc': post_data['created_utc'],
                'author': post_data['author'],
                'selftext': post_data['selftext']
            })

        print(f" Found {len(posts)} posts from r/{subreddit}")
        return posts

    except Exception as e:
        print(f" Error fetching Reddit posts: {e}")
        return []

# --- BASE ANALYZER FUNCTIONS ---
def download_image(image_url: str) -> Optional[Image.Image]:
    """Download image from URL"""
    try:
        print(f"    Downloading image...")
        response = requests.get(image_url, timeout=10)
        response.raise_for_status()
        return Image.open(BytesIO(response.content))
    except Exception as e:
        print(f"    Error downloading image: {e}")
        return None

def analyze_with_gemini(image: Image.Image, coc_link: str, th_level: int) -> Optional[str]:
    """
    Analyze image with Gemini AI (example function)
    Note: In a real implementation, you would configure the Gemini client here
    """
    try:
        # This is just an EXAMPLE of what the analysis might look like
        # In a real implementation, you would use the actual Gemini API
        print("    Generating example analysis (Gemini API would go here)...")

        # Example analysis - replace with actual API call in real implementation
        example_analysis = f"""# Strategic Turtle Base

## Overview
This is a well-designed Town Hall {th_level} turtle base that prioritizes protecting the Town Hall and Clan Castle. The core is heavily fortified with multiple layers of defenses.

## Pros and Cons
**Pros:**
- Excellent centralization of key defenses
- Multiple compartments to slow down attackers
- Well-placed Clan Castle in the center
- Good use of walls to create funneling

**Cons:**
- Air defenses are somewhat exposed
- Potential for air attacks to bypass outer layers
- Some splash damage defenses could be better protected

## Strategy Tips
- Use ground troops to trigger defenses before sending in air units
- Consider using jump spells to access the core
- Watch out for potential hog rider paths
- Queen charge might be effective if timed properly

## Defense Type
Turtle base - designed to protect the Town Hall at all costs, often at the expense of other buildings.

## Best For
Countering ground-based attacks like GoWiPe or mass hog riders. Less effective against pure air attacks.

Hastag: #COCBaseAnalysis #ClashOfClans #BaseLayout #ExampleAnalysis
"""
        return example_analysis

    except Exception as e:
        print(f"    Error generating analysis: {e}")
        return None

def get_pending_layouts(client: Any, limit: int = 5) -> List[Any]:
    """Get layouts that haven't been analyzed yet (example function)"""
    try:
        # This is an example query - in a real implementation you would use your actual database client
        print("    Querying database for pending layouts...")
        # Simulate database response
        example_layouts = [
            (1, 12, "https://link.clashofclans.com/?action=CopyLayout&id=TH12-Layout1", "https://example.com/th12-base1.png", "https://reddit.com/r/ClashOfClans/post1"),
            (2, 11, "https://link.clashofclans.com/?action=CopyLayout&id=TH11-Layout1", "https://example.com/th11-base1.png", "https://reddit.com/r/ClashOfClans/post2")
        ]
        return example_layouts[:limit]
    except Exception as e:
        print(f" Error querying database: {e}")
        return []

def update_layout_description(client: Any, layout_id: int, description: str) -> bool:
    """Update layout description in database (example function)"""
    try:
        print(f"    Updating layout #{layout_id} with analysis")
        # In a real implementation, this would update the database
        return True
    except Exception as e:
        print(f"    Error updating database: {e}")
        return False

def analyze_layouts(limit: int = 5) -> int:
    """Main function to analyze pending layouts"""
    print("=" * 60)
    print(" COC BASE ANALYZER - Example Script")
    print("=" * 60)
    print("  This is a SANITIZED example with placeholder values")
    print("   Replace all PLACEHOLDER values before running\n")

    try:
        # In a real implementation, you would initialize your database client here
        print(" Database connection would be established here (with real credentials)\n")

        layouts = get_pending_layouts(None, limit=limit)
        print(f" Found {len(layouts)} example layouts to analyze\n")

        if not layouts:
            print(" All layouts already analyzed!")
            return 0

        analyzed = 0

        for idx, layout in enumerate(layouts, 1):
            layout_id, th_level, copy_link, image_url, source_url = layout

            print(f"[{idx}]  Analyzing layout #{layout_id}")
            print(f"    TH Level: {th_level if th_level > 0 else '?'}")
            print(f"    Copy Link: {copy_link[:40]}...")

            if not image_url:
                print("     Skipped (no image)\n")
                continue

            # Download image
            image = download_image(image_url)
            if not image:
                print("     Skipped (image download failed)\n")
                continue

            # Analyze with "AI" (in this example, we generate placeholder analysis)
            description = analyze_with_gemini(image, copy_link, th_level)

            if description:
                # Update database
                if update_layout_description(None, layout_id, description):
                    analyzed += 1
                    print(f"     Description updated")
                    # Preview
                    preview = description.split('\n')[0:3]
                    print(f"    Preview: {preview[0][:60]}...\n")
                else:
                    print(f"     Failed to update database\n")
            else:
                print(f"    Analysis failed\n")

            # Rate limiting
            time.sleep(1)

    except Exception as e:
        print(f" Fatal error: {e}")
        return 0

    print("=" * 60)
    print(f" EXAMPLE COMPLETE!")
    print(f"   Total analyzed: {analyzed}/{len(layouts)} (this is just an example)")
    print("   In a real implementation, this would update your database")
    print("=" * 60)

    return analyzed

# --- MAIN EXECUTION ---
if __name__ == "__main__":
    import sys

    print("COC Base Analyzer & Reddit Scraper Example")
    print("=" * 50)
    print("This script demonstrates:")
    print("1. How to properly scrape Reddit using their API")
    print("2. How to analyze Clash of Clans base layouts")
    print("3. Proper handling of sensitive credentials\n")

    # Example 1: Reddit Scraper
    print("🔹 REDDIT SCRAPER EXAMPLE:")
    reddit_posts = get_reddit_posts("ClashOfClans", limit=3)
    if reddit_posts:
        for i, post in enumerate(reddit_posts, 1):
            print(f"   {i}. {post['title']} (↑{post['score']})")
            print(f"      {post['url']}\n")

    # Example 2: Base Analyzer
    print("\n🔹 BASE ANALYZER EXAMPLE:")
    limit = 2
    if len(sys.argv) > 1:
        try:
            limit = int(sys.argv[1])
        except:
            limit = 2

    print(f"⏳ Running example analysis with limit: {limit}\n")
    analyze_layouts(limit=limit)