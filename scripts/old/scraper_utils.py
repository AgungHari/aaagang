"""
Scraper utilities for Reddit COC base layouts
"""

import re
import requests
from typing import List, Dict, Any, Optional, Tuple

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
        from .auth_utils import get_reddit_token, REDDIT_USER_AGENT
        token = get_reddit_token()
        if not token:
            return None, []

        url = f"https://oauth.reddit.com/r/COCBaseLayouts/comments/{post_id}/.json"
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