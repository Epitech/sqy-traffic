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
def getLines(sentence):
  lines_pattern = re.compile(r"((?<=Ligne )\d+|^\d+\.\d+)", re.IGNORECASE)
  matches = lines_pattern.findall(sentence)
  
  if len(matches) >= 1:
    return matches[0]
  return None

# Trouver un URL dans le tweet donnant plus d'informations
def getDescription(sentence):
  url_pattern = re.compile(r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))")
  matches = url_pattern.findall(sentence)
  
  if matches:
    return [ x[0] for x in matches ]
  return None

def getLineFromTwitterAccount(account_name):
  if account_name in LINE_ACCOUNTS:
    return LINE_ACCOUNTS[account_name]
  return None

def getTimeDisruption(sentence, postedDate):
  hour_pattern = re.compile(r'(\d+h\d+)', re.IGNORECASE)
  
  begin_date = None
  end_date = None
  matches = datefinder.find_dates(sentence, index=True)
  
  # for d in matches:
  #   print(d)
  #   delta = datetime.today() - d[0];
  #   print(delta)
  #   print(abs(delta.total_seconds()))
  #   print(str(7 * 24 * 3600))
  valid_dates = [ d for d in matches if abs((datetime.today() - d[0]).total_seconds())  <= 7 * 24 * 3600 ]
  
  for match in valid_dates:
    print(match)
  if len(valid_dates) >= 2:
    begin_date = valid_dates[0]
    end_date = valid_dates[1]
    return begin_date, end_date
  elif len(valid_dates) == 1:
    begin_date = valid_dates[0]
    return begin_date, end_date
  # ## If no dates trying four hours
  match = re.search(r'(\d+h\d+)', sentence)
  if match is None:
    return None, None
  hour, mins = tuple(list(map(int, match.group(0).split('h'))))
  datetime_tweet = datetime.strptime(postedDate, "%Y-%m-%dT%H:%M:%S.%fZ")
  begin_date = (datetime(datetime_tweet.year, datetime_tweet.month, datetime_tweet.day, hour=hour, minute=mins), (match.start(0), match.end(0)-1))
  return begin_date, end_date

def shouldSendError(result):
  return result["line"] == None or result["begin_date"] == None

def semantic_analysis(tweet):
  result = { "line": None, "begin_date": None, "end_date": None, "description": None}
  error = { "code": 1, "message": "Not enough information found !"}
  
  if tweet["hasDisruption"] is False:
    error["code"] = 2
    error["message"] = "No disruption found"
    return error
  
  sent_tknzr = LineTokenizer("french")
  sentences = [ s.lower() for s in sent_tknzr.tokenize(tweet["text"]) if s not in punct ]
  print(tweet["text"])
  # for sentence in sentences:
  beg_date, end_date = getTimeDisruption(tweet["text"], tweet["postedDate"])
  print(beg_date, end_date)
  if result['begin_date'] is None or result['end_date'] is None:
    if result['begin_date'] is None:
      result['begin_date'] = str(beg_date)
    if result['end_date'] is None:
      result['end_date'] = str(end_date)
      
    # if not result['description']:
    #   result['description'] = getDescription(sentence)
  if not result['line']:
    result['line'] = getLines(tweet["text"])
  
      
  if not result['line']:
    result['line'] = getLineFromTwitterAccount(tweet['accountName'])
  # Prefering send error if cound't anlayze well the tweet
  # if shouldSendError(result):
  #   return error
  return result

if __name__ == "__main__":
    data = getJsonData()
    result = list(map(semantic_analysis, data))
    # print(json.dumps(result))