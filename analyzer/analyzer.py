import json
from sys import stdin
import nltk
import re
from cltk.tokenizers.line import LineTokenizer
import datefinder
from datetime import datetime

punct = ['.', ',' ':', '...', '?', ';', '!']

## Récupération du corpus de tweets grâce via stdin
def getJsonData():
    lines = []
    for line in stdin:
        lines.append(line)
    return json.loads("".join(lines))

def shouldSendError(result):
  return result["line"] == None or result["begin_date"] == None
    

def semantic_analysis(tweet):
  result = { "line": None, "begin_date": None }
  error = { "code": 1, "message": "Not enough information found !"}
  sent_tknzr = LineTokenizer("french")
  sentences = [ s.lower() for s in sent_tknzr.tokenize(tweet["text"]) if s not in punct ]
  for sentence in sentences:
    print(getTimeDisruption(sentence))
    getDescription(sentence)
    getLines(sentence)
  
  # Prefering send error if cound't anlayze well the tweet
  if shouldSendError(result):
    return error
  return result

def getTimeDisruption(sentence):
  begin_date = None
  end_date = None
  matches = datefinder.find_dates(sentence)
  valid_dates = [ d for d in matches if d.year >= datetime.today().year]
  if len(valid_dates) >= 2:
    begin_date = valid_dates[0]
    end_date = valid_dates[1]
  elif len(valid_dates) == 1:
    begin_date = valid_dates[0]
  else:
    return None
  return begin_date, end_date

# Récupérer les identifiants de lignes
def getLines(sentence):
  lines_pattern = re.compile(r"((?<=Ligne )\d+|^\d+\.\d+)", re.IGNORECASE)
  matches = lines_pattern.findall(sentence)
  for match in matches:
    print(match)
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

if __name__ == "__main__":
    data = getJsonData()
    result = list(map(semantic_analysis, data))
    print(json.dumps(result))