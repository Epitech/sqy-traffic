import json
from sys import stdin
import nltk
from nltk.tokenize import TweetTokenizer
from nltk.corpus import stopwords
import emoji
import re
from cltk.tokenizers.line import LineTokenizer
import datefinder
from datetime import datetime

stop_words = set(stopwords.words("french"))
stop_words.remove('au')

punct = ['.', ',' ':', '...', '?', ';', '!']

## Récupération du corpus de tweets grâce via stdin
def getJsonData():
    lines = []
    for line in stdin:
        lines.append(line)
    return json.loads("".join(lines))

def process_sentence(sentence):
    tknzr = TweetTokenizer()
    tagged = [ w for w in tknzr.tokenize(sentence) if w not in punct if w != b"\xef\xb8\x8f".decode('utf-8')  if w not in stop_words]
    print(tagged)
    

def semantic_analysis(data):
  pass


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


if __name__ == "__main__":
    # p = parsedatetime.Calendar()
    data = getJsonData()
    # create_sentence(data)
    for tweet in data:
      print(tweet["text"])
    # tweet = data[8]
    
      sent_tknzr = LineTokenizer("french")
      sentences = [ s.lower() for s in sent_tknzr.tokenize(tweet["text"]) if s not in punct ]
      for sentence in sentences:
        print(getTimeDisruption(sentence))