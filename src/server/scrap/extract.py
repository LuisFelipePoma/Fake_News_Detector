from bs4 import BeautifulSoup
import requests
from urllib.parse import urljoin


def extract(url: str):
    try:
        index = 2 if "snopes" in url else 1
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        title = soup.title.string if soup.title else None

        # Identify the tags that contain the main content
        content_tags = soup.find_all("p")  # Change 'p' to the appropriate tag

        # Extract the text from these tags
        content = " ".join(tag.get_text() for tag in content_tags)

        img_tags = soup.find_all("img")
        img_urls = [urljoin(url, img["src"]) for img in img_tags if img.get("src")]
        return {
            "url": url,
            "title": title,
            "content": content,
            "image": img_urls[index] if img_urls else None,
        }
    except Exception as error:
        print("Error during scraping:", error)
        return None
