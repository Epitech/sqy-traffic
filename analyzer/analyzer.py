import json
from sys import stdin
import nltk
import re
from cltk.tokenizers.line import LineTokenizer
from datetime import datetime, date
import datefinder

LINE_ACCOUNTS = {
  "RERC_SNCF": "RER C",
  "lignesNetU_SNCF": "Lignes N et U"
}

punct = ['.', ',' ':', '...', '?', ';', '!']

## Récupération du corpus de tweets grâce via stdin
def getJsonData():
  lines = []
  
  for line in stdin:
      lines.append(line)
  return json.loads("".join(lines))
  
# Récupérer les identifiants de lignes
def getLines(sentence, result):
  lines_pattern = re.compile(r"((?<=Ligne )\d+|^\d+\.\d+)", re.IGNORECASE)
  match = re.search(r"((?<=Ligne )\d+|^\d+\.\d+)", sentence)
  
  if match is not None:
    result['line'] = { "data": match.group(0), "span": { "start": match.start(0), "end": match.end(0) } }
    return
  result['line'] = { "data": None, "error": "Not enough information" }

# Trouver un URL dans le tweet donnant plus d'informations
def getDescription(sentence, result):
  url_pattern = re.compile(r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))")
  match = url_pattern.search(sentence)
  
  if match:
    result['description'] = {"data" : match.group(0), "span": { "start": match.start(0), "end": match.end(0) } }
    return
  result['description'] = { "data": None, "error": "Not enough information" }

def getLineFromTwitterAccount(account_name, result):
  if account_name in LINE_ACCOUNTS:
    result['line']['data'] = LINE_ACCOUNTS[account_name]
    del result['line']['error']

def getTimeDisruption(sentence, postedDate, result):
  error = { "data": None, "message": "Not enough information found !"}
  hour_pattern = re.compile(r'(\d+h\d+)', re.IGNORECASE)
  
  begin_date = None
  end_date = None
  matches = datefinder.find_dates(sentence, index=True)
  valid_dates = [ d for d in matches if abs((datetime.today() - d[0]).total_seconds())  <= 7 * 24 * 3600 ]
  
  if len(valid_dates) >= 2:
    begin_date = valid_dates[0]
    end_date = valid_dates[1]
  elif len(valid_dates) == 1:
    begin_date = valid_dates[0]  
  # ## If no dates trying for hours
  else:
    match = re.search(r'(\d+h\d+)', sentence)
    if match is None:
      result['begin_date'] = error
      result['end_date'] = error
      return
    hour, mins = tuple(list(map(int, match.group(0).split('h'))))
    datetime_tweet = datetime.strptime(postedDate, "%Y-%m-%dT%H:%M:%S.%fZ")
    begin_date = (datetime(datetime_tweet.year, datetime_tweet.month, datetime_tweet.day, hour=hour, minute=mins), (match.start(0), match.end(0)-1))
  
  if begin_date is not None:
    result['begin_date'] = { "data": str(begin_date[0]), "span": { "start": begin_date[1][0], "end": begin_date[1][1] } }
  else:
    result['begin_date'] = error
  if end_date is not None:
    result['end_date'] = { "data": str(end_date[0]), "span" : { "start": end_date[1][0], "end": end_date[1][1] } }
  else:
    result['end_date'] = error


def shouldSendError(result):
  return result["line"] == None or result["begin_date"] == None

def semantic_analysis(tweet):
  result = { "line": None, "begin_date": None, "end_date": None, "description": None}
  error = { "code": 1, "message": "Not enough information found !"}
  
  if tweet["hasDisruption"] is False:
    error["code"] = 2
    error["message"] = "No disruption found"
    return error
  
  getTimeDisruption(tweet["text"], tweet["postedDate"], result)
  getDescription(tweet["text"], result)
  getLines(tweet["text"], result)
  if not result['line']['data']:
    getLineFromTwitterAccount(tweet['accountName'], result)  
  # Prefering send error if cound't anlayze well the tweet
  # if shouldSendError(result):
  #   return error
  return result

if __name__ == "__main__":
    data = getJsonData()
    result = list(map(semantic_analysis, data))
    print(json.dumps(result))