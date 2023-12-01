from bs4 import BeautifulSoup
import random
import requests
from urllib.parse import urljoin


from consts.consts import PAGES_NEWS

cachelinks = {}


def scrape_links(url):
    try:
        # Send a GET request to the URL
        response = requests.get(url)
        # Parse the HTML content
        soup = BeautifulSoup(response.text, "html.parser")
        links = [urljoin(url, a["href"]) for a in soup.find_all("a", href=True)]
        links = [
            href
            for href in links
            if (
                (".html" in href 
                 or "0" in href 
                 or "article" in href)
                and not (
                    "video" in href
                    or "podcast" in href
                    or "season" in href
                    or "2024_presidential_campaign" in href
                )
            )
        ]
        return links[:5]
    except Exception as error:
        print("Error during scraping:", error)
        raise


# Function to randomly select two different links from a list
def random_links(links):
    index1 = random.randint(0, len(links) - 1)
    index2 = index1
    while index2 == index1:
        index2 = random.randint(0, len(links) - 1)
    return [links[index1], links[index2]]


# Function to get links from a page and cache them
def get_links_page():
    index = random.randint(0, len(PAGES_NEWS) - 1)
    page = PAGES_NEWS[index]
    links = cachelinks.get(page)
    if links is None:
        links = scrape_links(page)  # replace with your scraping function
        cachelinks[page] = links
    return random_links(links)


# Function to scrape links from all pages and cache them
def catch_cards():
    print("Catching data")
    for i in range(len(PAGES_NEWS)):
        try:
            links = scrape_links(PAGES_NEWS[i])  # replace with your scraping function
            cachelinks[PAGES_NEWS[i]] = links
        except Exception as error:
            print("Error:", error)
            raise
    print("Finishing catching data")
