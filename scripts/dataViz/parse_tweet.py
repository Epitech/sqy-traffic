import json

from sys import argv


def concat_tweets(tweets: dict) -> str:
    result = ""
    for tweet in tweets:
        result += tweet["text"]
    return result


def concat_tweets_by_transporter(tweets: dict, transporter: str = None) -> str:
    if transporter is None:
        result = ""
        for key in tweets.keys():
            result += concat_tweets(tweets[key])
        return result
    else:
        return concat_tweets(tweets[transporter])

def remove_useless_words(data: str):
    useles_char = ['/', '[', '@', ',', ']', "https", '.', '`', '\'', ':', '#', '!', '(!)', ')', '-', '_', '\\',
    'des ', 'de ', 'les ', 'le ', 'la ', 'vos ', 'son ', 'nos ', 'notre ', 'à ', 'a ', 'je ', 'tu ', 'ils ', 'il ', 'elles ', 'elles ', 'on '
    'ces ', 'ce ', 'en ', 'sur ', 'votre ', 'notre ', 'leurs ', 'leur ', 'reste ', ]

    for c in useles_char:
        data = data.replace(c, '')
    return data

def loads_all_tweets_content(ac: int = len(argv), av: [str] = argv[1:]):
    if ac != 2:
        print("Error: python3 parse_tweet.py <file>")

    result = ""
    with open(av[0], "r") as file:
        data = json.load(file)
        result += f" {concat_tweets_by_transporter(data)}"

    return result


if __name__ == '__main__':
    print(loads_all_tweets_content(len(argv), argv[1:]))
