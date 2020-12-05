import { Injectable } from "@nestjs/common"
import { Interval } from "@nestjs/schedule"
import { TwitterAccounts } from "../twitter-sdk/constants"
import Twitter from "../twitter-sdk/twitter"
import { API_TOKEN } from "../../config/environnement"

@Injectable()
export default class TrafficService {
  private readonly twitter: Twitter

  constructor() {
    this.twitter = new Twitter(API_TOKEN)
  }

  // Every 60 seconds
  @Interval(60 * 1000)
  async fetchTweets(): Promise<void> {
    // Fetch last tweet id of each account
    // const accounts = await this.xxxx.accountsWithLastTweetId()
    // const tweetsByAccount = await Promise.all(accounts.map({ name, lastTweetId }) => {})
    const lastTweetId = "123456"

    const tweetsByAccount = await Promise.all(
      Object.values(TwitterAccounts).map(async (account) => {
        const tweets = await this.twitter.getTweets(account, { sinceId: lastTweetId, maxResults: 1 })

        return {
          account,
          tweets,
        }
      }),
    )

    console.log(tweetsByAccount)
  }
}
