# SQY-Traffic

SQY-Traffic is a real-time traffic disruption analysis based on Tweet scrapping from transporters <a href="https://twitter.com">Twitter</a> account.

The goals of this project are:

- Allowing people to know faster if there is any problem on his route

- Researching a efficient way to analyze and parse traffic data on micro-blogging text, in this case Tweets (~200 characters)

- Providing a simple & scalable solution to expose realtime data to be used by anyone

The solution we designed is divided into 4 parts:

- **PostgresSQL database**: To store different information about the transporters, the tweets scrapped, and the disruptions analyzed

- **Analyzer**: This part determines if a tweet **IS** a disruption, and extracts disruption data from it

- **Twitter Crawler**: Scheduled to call the Twitter API every minute and get the Transporters' newest tweets, it stores them into the database

- **NestJS Typsescript API**: Allows users to get in realtime the newest disruption information available


## Installation

To run SQY-Traffic API, you there is 2 solutions:

#### With Node (Development):

You must have Node >= 15 installed:

```
$ npm install
$ npm start
```


#### With Docker:
- <a href="https://docs.docker.com/engine/install/">How to install Docker</a>

You can build the docker image from source:

```bash
$ git clone https://github.com/Epitech/sqy-traffic.git sqy-traffic
$ cd sqy-traffic
$ docker build -t "sqy-traffic:latest" .
```

Now, You can run the API with the following command:
```bash
$ docker run --rm -it --name -p 3000:3000 "sqy_api" "sqy-traffic:latest"
```


## Analyzer

The Analyzer service is the core of SQY-Traffic solution, so we imagined several way of research in order to obtain a solution ready for production context.



#### How to obtain relevant inforation from tweets ?




## Contributors