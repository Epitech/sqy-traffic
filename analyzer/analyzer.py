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
    create_sentence(data)
    tweet = data[8]
    sentences = [ s for s in sent_tokenize(tweet["text"]) if s not in punct ]
    process_sentence(sentences[3])
    # words = [ w for w in tknzr.tokenize(tweet["text"]) if w != b"\xef\xb8\x8f".decode('utf-8') if w not in stop_words ]

   
    # print(words)
    # result = list(map(semantic_analysis, data))
    # print(result)
    