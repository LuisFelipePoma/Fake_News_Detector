import asyncio
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import jsonify

# import own modules
from model.model import handleData
from schema.schema import get_body
from scrap.extract import extract
from scrap.scrap import catch_cards, get_links_page

app = Flask(__name__)
CORS(app)

cache_request = {}


@app.route("/", methods=["GET"])
def home():
    return "APIS for Web Scrapping!!!", 200


@app.route("/scrap", methods=["GET"])
def scrap():
    item = request.args.get("url")
    if cache_request.get(item):
        news = cache_request[item]
        return jsonify(news)
    _new = extract(item)  # replace with your extraction function
    _new = handleData(_new)  # replace with your data handling function
    news = get_body(_new)  # replace with your body getting function
    cache_request[item] = news
    return jsonify(news)


@app.route("/cards", methods=["GET"])
def cards():
    print("Request to /cards/")
    items = get_links_page()  # replace with your links page getting function
    results = []
    for item in items:
        if cache_request.get(item):
            results.append(cache_request[item])
        else:
            try:
                _new = extract(item)  # replace with your extraction function
                _new = handleData(_new)  # replace with your data handling function
                body = get_body(_new)  # replace with your body getting function
                cache_request[item] = body
                results.append(body)
            except Exception as error:
                print("Error during scraping:", error)
                body = get_body(None)  # replace with your body getting function
                results.append(body)
    return jsonify(results)


def main():
    catch_cards()
    app.run(port=8000, host="0.0.0.0")


if __name__ == "__main__":
    asyncio.run(main())
