"""
Reddit authentication utilities for scraper
"""

import requests
from typing import Optional

# --- PLACEHOLDER CONFIGURATION ---
# Replace these with your actual credentials when using this script

# Reddit API Configuration only if using Reddit's API (not required for basic scraping, but recommended for proper access)
REDDIT_CLIENT_ID = "your_reddit_client_id"        # Register at https://www.reddit.com/prefs/apps
REDDIT_CLIENT_SECRET = "your_reddit_client_secret"
REDDIT_USER_AGENT = "script:coc_base_scraper:v1.0 (by /u/your_username)"
REDDIT_USERNAME = "your_reddit_username"          # Your Reddit username
REDDIT_PASSWORD = "your_reddit_password"          # Your Reddit password

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