import { Injectable } from "@nestjs/common"
import { Interval, Timeout } from "@nestjs/schedule"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { TweetSchema } from "../model/tweet.entity"
import { TwitterAccounts } from "../twitter-sdk/constants"
import Twitter from "../twitter-sdk/twitter"
import { API_TOKEN } from "../../config/environnement"

@Injectable()
export default class TrafficService {
  private readonly twitter: Twitter

  constructor(@InjectRepository(TweetSchema) private dbTweet: Repository<TweetSchema>) {
    this.twitter = new Twitter(API_TOKEN)
  }

  private findDisruptionInTweet(text: string): boolean {
    const formatText = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
    const keywords = [
      "perturbation",
      "travaux",
      "incident",
      "accident",
      "probleme",
      "modif", // ication, ifié, etc.
      "ralenti", // ssement, etc.

      "interrom", // pu, pre, etc.

      "suppression",
      "supprime", // r, etc.

      "retard",
      "deviation",
      // "ne pas desservir",
      "toutes nos excuses",
      "gene occasionnee.",
      "Nous nous excusons",
      "ne sera pas effectue",
      "reporte",
      "intervention",
    ]
    return keywords.some((keyword) => formatText.includes(keyword))
  }

  // Every 60 seconds
  @Interval(60 * 1000)
  async fetchTweets(): Promise<void> {
    // Fetch last tweet id of each account
    // const accounts = await this.xxxx.accountsWithLastTweetId()
    // const tweetsByAccount = await Promise.all(accounts.map({ name, lastTweetId }) => {})
    const lastTweetId = "123456"

    const tweetsByAccount = (
      await Promise.all(
        Object.values(TwitterAccounts).map(
          async (account): Promise<Omit<TweetSchema, "id">[] | undefined> => {
            const tweets = await this.twitter.getTweets(account, {
              /* sinceId: lastTweetId, maxResults: 1 */
            })

            return tweets?.map((tweet) => ({
              tweetId: tweet.id,
              text: tweet.text,
              accountName: account,
              hasDisruption: this.findDisruptionInTweet(tweet.text),
              postedDate: new Date(Date.parse(tweet.created_at)),
            }))
          },
        ),
      )
    )
      .filter((row) => row !== undefined)
      .flat()

    // Todo: Remove onConflict
    await this.dbTweet
      .createQueryBuilder()
      .insert()
      .into(TweetSchema)
      .values(tweetsByAccount as TweetSchema[])
      .onConflict("DO NOTHING")
      .execute()
  }

  async getTweets(): Promise<TweetSchema[]> {
    return this.dbTweet.find()
  }
}
