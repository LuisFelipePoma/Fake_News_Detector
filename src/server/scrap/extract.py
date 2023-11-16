from bs4 import BeautifulSoup
import requests
from urllib.parse import urljoin


def extract(url: str):
    try:
        index = 2 if "snopes" in url else 1
        # Send a GET request to the URL
        response = requests.get(url)
        # Parse the HTML content
        soup = BeautifulSoup(response.text, "html.parser")
        # Extract the title
        title = soup.title.string if soup.title else None
        # Extract the text
        text = soup.get_text()
        # Find all the 'img' tags
        img_tags = soup.find_all("img")
        # Extract the 'src' attribute from each 'img' tag
        img_urls = [urljoin(url, img["src"]) for img in img_tags if img.get("src")]
        return {
            "url": url,
            "title": title,
            "content": text,
            "image": img_urls[index] if img_urls else None,
        }
    except Exception as error:
        print("Error during scraping:", error)
        return None
