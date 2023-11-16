def get_body(item):
    if item:
        return {
            "title": item.get("title", "no title"),
            "image": item.get(
                "image",
                "https://static.vecteezy.com/system/resources/previews/005/337/799/large_2x/icon-image-not-found-free-vector.jpg",
            ),
            "url": item.get("url", "/"),
            "tokens": item.get("tokens"),
        }
    else:
        return {
            "title": "No title",
            "image": "https://static.vecteezy.com/system/resources/previews/005/337/799/large_2x/icon-image-not-found-free-vector.jpg",
            "url": "/",
            "tokens": [0],
        }
