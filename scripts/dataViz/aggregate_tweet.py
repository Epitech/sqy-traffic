import json
import requests as rq

import twitterSDK

BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAEwlKQEAAAAA%2FaxU%2F9GAfdDInpH88muoBnD2wIY%3DO8W9TskqivJkIlAdUCVfLAw6YOkiNR12R28SjZYIuDwONSWk0u"

usernames = [
    "RERC_SNCF",
    "lignesNetU_SNCF",
    "RemiTrainPCLM",
    "InfoSqybus",
    "CarsHourtoule",
    "StavoInfoLignes",
    "TransdevSud78",
    "ALBATRANS91",
    "Actu_Savac",
]

data = {}

twitter_sdk = twitterSDK.TwitterSDK(BEARER_TOKEN)

for username in usernames:
    data[username] = twitter_sdk.aggregate_tweets(username, 75)
# print(result.status_code, json.dumps(str(result.content)).keys())
# print(result.status_code, json.load(str(result.content)).keys())

print(json.dumps(data, indent=4))
