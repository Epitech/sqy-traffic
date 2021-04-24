#! /bin/python3

from google.transit import gtfs_realtime_pb2
import urllib.request

feed = gtfs_realtime_pb2.FeedMessage()
response = urllib.request.urlopen('http://localhost:3000/api/0.0.1/disruptions')
feed.ParseFromString(response.read())
print(feed)