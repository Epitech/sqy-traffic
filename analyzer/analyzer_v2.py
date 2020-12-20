#!/usr/bin/env python3
import requests


class RequestHandler:
  def __init__(self, url="https://127.0.0.1:3000/api/0.0.1/twitter"):
    self.url = url
    
  def _call(self, method, endpoint, headers = {}, body = {}):
    requests.Request
    if method == "GET":
      r = requests.get(f"{self.url}{endpoint}", headers=headers, data=body)
    elif method == "POST":
      r = requests.post(f"{self.url}{endpoint}", headers=headers, data=body)
    else:
      raise Exception("Unknown Method")
    return r.json()
    
  def get_tweets_to_process(self):
    try:
      tweets = self._call("GET", "/processing")
      return tweets
    except Exception:
      return {}
    
 