import re
import json
import nltk
import numpy as npy

from PIL import Image
from nltk.corpus import stopwords
from nltk import word_tokenize
from nltk.tokenize import sent_tokenize
from wordcloud import WordCloud, STOPWORDS
from parse_tweet import loads_all_tweets_content, remove_useless_words

# french_stopwords = set(stopwords.words('french'))
# filtre_stopfr =  lambda text: [token for token in text if token.lower() not in french_stopwords]

# to_ana = filtre_stopfr(word_tokenize(loads_all_tweets_content(), language="french"))
# print(to_ana)
# fd = nltk.FreqDist(to_ana)

# print(fd.most_common())



dataset = loads_all_tweets_content()
print(dataset[:1000])
exit()
dataset = remove_useless_words(dataset)

def create_word_cloud(string):
   # maskArray = npy.array(Image.open("cloud.jpg"))
   cloud = WordCloud(background_color="white", max_words=100, stopwords=set(STOPWORDS))
   cloud.generate(string)
   cloud.to_file("wordCloud.png")

dataset = dataset.lower()
create_word_cloud(dataset)
