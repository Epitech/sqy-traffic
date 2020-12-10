import spacy
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize, wordpunct_tokenize, TweetTokenizer
from nltk.stem import PorterStemmer
from nltk.corpus import stopwords
import json
from sys import stdin
import re

stop_words = set(stopwords.words("french"))
stop_words.add(":")
stop_words.add('.')
stop_words.add(';')
stop_words.add(',')
stop_words.remove('au')
## Récupération du corpus de tweets grâce via stdin
def getJsonData():
    lines = []
    for line in stdin:
        lines.append(line)
    return json.loads("".join(lines))


def create_sentences(data):
    for d in data:
        text = re.sub(r'\n+', '\n', d["text"])
        data[data.index(d)]["text"] = ". ".join(text.split('\n'))

def pre_process(txt):
    sentences = sent_tokenize(txt)
    twtTknzr = TweetTokenizer(strip_handles=True, reduce_len=True)
    tokens = []
    for sentence in sentences:
        tokens.append(nltk.pos_tag([ tok for tok in twtTknzr.tokenize(sentence) if tok not in stop_words]))
    return tokens

if __name__ == "__main__":
    data = getJsonData()
    create_sentences(data)
    sent_tokens = pre_process(data[9]["text"])
    
# Data pour example: index 8