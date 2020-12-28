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
    // TODO: use logger via nestjs
    console.info("[INFO] Cron: start fetching tweets")

    const accounts = await this.prisma.network.findMany({
      select: {
        id: true,
        tweeterAccount: true,
        Tweet: {
          // Latest tweet
          select: {
            tweetId: true,
            postedAt: true,
          },
          take: 1,
          orderBy: {
            postedAt: "desc",
          },
        },
      },
    })

    const sevenDaysInMS = 7 * 24 * 60 * 60 * 1000
    const oldestValidDateForSinceId = new Date().getTime() - sevenDaysInMS

    const tweetsByAccount = (
      await Promise.all(
        accounts.map(
          async (account): Promise<Prisma.TweetCreateInput[]> => {
            // Noctilien, stile ?
            if (!account.tweeterAccount) {
              return []
            }

            const params: GetTweetsQuery = {
              max_results: 100,
            }
            const latestTweetForAccount = account.Tweet[0]
            if (latestTweetForAccount && latestTweetForAccount.postedAt.getTime() > oldestValidDateForSinceId) {
              params.since_id = latestTweetForAccount.tweetId
            }
            const tweets = await this.twitter.getTweets(account.tweeterAccount, params)

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
        console.error(e)
      }
    }

    console.info(`[INFO] Cron: ${tweetsByAccount.length} fetched`)
  }

  async getTweets(): Promise<Tweet[]> {
    return this.prisma.tweet.findMany()
  }

  async getTweetsToBeProcessed(): Promise<Tweet[]> {
    return this.prisma.tweet.findMany()
  }
}
