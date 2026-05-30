"""
Scraper utilities for Reddit COC base layouts
"""

import re
from typing import List, Optional, Tuple

def extract_th_level(flair_text: str) -> int:
    """Extract TH level from flair text"""
    if not flair_text:
        return 0
    match = re.search(r'(\d+)', str(flair_text))
    if match:
        level = int(match.group(1))
        # If level > 20, return 0 (invalid)
        return level if level <= 20 else 0
    return 0

def find_coc_links(text: str) -> List[str]:
    """Find all Clash of Clans copy links in text"""
    if not text:
        return []
    matches = re.findall(r'https://link\.clashofclans\.com/[^\s\)"\]<>]+', text)
    return [link.replace('&', '&') for link in matches]

def extract_image_from_post(driver) -> Optional[str]:
    """
    Example function to extract image URL from post.
    This demonstrates what the extraction process would look like.
    """
    try:
        print("   Extracting post image (example)...")

        # In a real implementation, this would use Selenium to find the image
        # post_image = driver.find_element(By.ID, "post-image")

        # This is just an example - return a placeholder image URL
        return "https://example.com/th12-base.png"

    except Exception as e:
        print(f"   Error extracting post image (example): {e}")
        return None

def get_coc_links_from_post_page(driver) -> List[str]:
    """
    Example function to extract COC links from post page.
    This demonstrates what the extraction process would look like.
    """
    coc_links = []

    try:
        print("   Extracting COC links from post (example)...")

        # In a real implementation, this would:
        # 1. Scroll to load comments
        # 2. Get page HTML
        # 3. Extract links using regex

        # This is just an example - return placeholder links
        return [
            "https://link.clashofclans.com/?action=CopyLayout&id=TH12-Layout1",
            "https://link.clashofclans.com/?action=CopyLayout&id=TH12-Layout2"
        ]

    except Exception as e:
        print(f"   Error getting COC links (example): {e}")
        return coc_links

def find_posts_on_page(driver) -> List:
    """
    Example function to find post containers on page.
    This demonstrates what the post finding process would look like.
    """
    print("   Finding posts on page (example)...")

    # In a real implementation, this would use multiple CSS selectors
    # to find post containers

    # This is just an example - return mock post elements
    from .driver_utils import MockElement
    return [MockElement("div", {"text": "TH12 Base Layout - Anti 3 Star"}),
            MockElement("div", {"text": "TH11 Farming Base"})]

def get_post_title_and_url(post_element) -> Tuple[Optional[str], Optional[str]]:
    """
    Example function to extract title and URL from post element.
    This demonstrates what the extraction process would look like.
    """
    try:
        print("   Extracting post title and URL (example)...")

        # In a real implementation, this would extract from the actual post element

        # This is just an example - return placeholder data
        if "TH12" in post_element.text:
            return "TH12 Base Layout - Anti 3 Star", "https://www.reddit.com/r/COCBaseLayouts/comments/example1/th12_base/"
        else:
            return "TH11 Farming Base", "https://www.reddit.com/r/COCBaseLayouts/comments/example2/th11_farm/"

    except Exception as e:
        print(f"   Error extracting title/url (example): {e}")
        return None, None