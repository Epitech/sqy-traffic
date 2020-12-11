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
  error = { "data": None, "error": "Not enough information found !"}
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
=======
import spacy
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize, wordpunct_tokenize, TweetTokenizer
from nltk.stem import PorterStemmer
from nltk.corpus import stopwords
=======
>>>>>>> feat: fix begin new approach with by-sentence analysis
import json
from sys import stdin
import nltk
from nltk.tokenize import word_tokenize, TweetTokenizer, sent_tokenize
from nltk.corpus import stopwords, wordnet
from nltk.stem import WordNetLemmatizer
import emoji
import re

lemmatizer = WordNetLemmatizer()


stop_words = set(stopwords.words("french"))
stop_words.remove('au')

punct = ['.', ',' ':', '...', '?', ';', '!']


def to_wordnet_tag(tag):
  if tag.startswith('J'):
    return wordnet.ADJ
  elif tag.startswith('N'):
    return wordnet.NOUN
  elif tag.startswith('V'):
    return wordnet.VERB
  elif tag.startswith('R'):
    return wordnet
  else:
    return None

## Récupération du corpus de tweets grâce via stdin
def getJsonData():
    lines = []
    for line in stdin:
        lines.append(line)
    return json.loads("".join(lines))
  

def process_sentence(sentence):
    tknzr = TweetTokenizer()
    tagged = nltk.pos_tag([ w for w in tknzr.tokenize(sentence) if w not in punct if w != b"\xef\xb8\x8f".decode('utf-8')  if w not in stop_words])
    
    wordnet_tagged = map(lambda x: (x[0], to_wordnet_tag(x[1])), tagged)
    lemmatized_sent = []
    for word, tag in wordnet_tagged:
      if tag is None:
        lemmatized_sent.append(word)
      else:
        lemmatized_sent.append(lemmatizer.lemmatize(word, tag))
    print(lemmatized_sent)


def create_sentence(data):
    for i in range(len(data)):
      data[i]["text"] = ". ".join(re.sub(r'\\n+', '\n', data[i]["text"]).split("\n"))
# Run semantic analysis and deliver informations with functional format
def semantic_analysis(data):
  pass

if __name__ == "__main__":
    data = getJsonData()
<<<<<<< HEAD
    create_sentences(data)
    sent_tokens = pre_process(data[9]["text"])
    
# Data pour example: index 8
=======
    create_sentence(data)
    tweet = data[8]
    sentences = [ s for s in sent_tokenize(tweet["text"]) if s not in punct ]
    process_sentence(sentences[3])
    # words = [ w for w in tknzr.tokenize(tweet["text"]) if w != b"\xef\xb8\x8f".decode('utf-8') if w not in stop_words ]

   
    # print(words)
    # result = list(map(semantic_analysis, data))
    # print(result)
