import { Injectable } from "@nestjs/common"
import { Interval } from "@nestjs/schedule"
import { Prisma, Tweet } from "@prisma/client"
import Twitter, { GetTweetsQuery } from "../twitter-sdk"
import { API_TOKEN } from "../../config/environnement"
import { PrismaService } from "../prisma.service"

@Injectable()
export default class TwitterService {
  private readonly twitter: Twitter

  constructor(private prisma: PrismaService) {
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

  // Every 60 --seconds--
  // *minutes for test
  @Interval(60 * 60 * 1000)
  async fetchTweets(): Promise<void> {
    const accounts = await this.prisma.tweeterAccount.findMany({
      select: {
        id: true,
        name: true,
        Tweet: {
          // Latest tweet
          select: {
            tweetId: true,
          },
          take: 1,
          orderBy: {
            postedAt: "asc",
          },
        },
      },
    })

    const tweetsByAccount = (
      await Promise.all(
        accounts.map(
          async (account): Promise<Prisma.TweetCreateInput[]> => {
            const params: GetTweetsQuery = {
              max_results: 100,
              // TODO: latest tweet
            }
            if (account.Tweet.length === 1) {
              params.since_id = account.Tweet[0].tweetId
            }
            const tweets = await this.twitter.getTweets(account.name, params)

            return (
              tweets?.map((tweet) => ({
                tweetId: tweet.id,
                text: tweet.text,
                author: {
                  connect: {
                    id: account.id,
                  },
                },
                hasDisruption: this.findDisruptionInTweet(tweet.text),
                postedAt: new Date(Date.parse(tweet.created_at)),
              })) || []
            )
          },
        ),
      )
    ).flat()

    // TODO: replace syntax (no batch with prisma...)
    for (const tweet of tweetsByAccount) {
      try {
        await this.prisma.tweet.create({ data: tweet })
      } catch (e) {
        //
      }
    }
  }

  async getTweets(): Promise<Tweet[]> {
    return this.prisma.tweet.findMany()
  }

  async getTweetsToBeProcessed(): Promise<Tweet[]> {
    return this.prisma.tweet.findMany()
  }
}
