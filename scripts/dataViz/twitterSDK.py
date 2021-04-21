import json
import requests


class TwitterSDK:
    base_url = "https://api.twitter.com/2"

    headers = {
        "Accept": "application/json",
        "Authorization": "TOKEN"
    }

    def __init__(self, token: str):
        self.headers["Authorization"] = f"Bearer {token}"

    def search_tweets(self, username: str, next_token: str = ""):
        url = f"{self.base_url}/tweets/search/recent?query=from:{username}&max_results=100&tweet.fields=created_at"
        if next_token != "":
            url = f"{url}&next_token={next_token}"

        result = requests.get(url, headers=self.headers)
        if result.status_code != 200:
            return {}
        return json.loads(result.content)

    # {
    #   data: []
    #   meta: {
    #       "next_token"
    #   }
    # }
    def aggregate_tweets(self, username: str, page: int):
        data = []
        token = ""

        for i in range(0, page):
            tweets = self.search_tweets(username, token)
            if tweets == {} or tweets["meta"]["result_count"] == 0:
                break

            data.extend(tweets["data"])
            meta = tweets["meta"]

            if meta["result_count"] == 100:
                token = meta["next_token"]
            else:
                i = (page - 1)
        return data
