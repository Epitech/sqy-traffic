import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import { DisruptionWithTweet } from "./gtfs.data"

@Injectable()
export default class DisruptionService {
  constructor(private prisma: PrismaService) {}

  async storeNewDisruptions(): Promise<void> {
    console.log("Storing new disruptions found!")
    // await this.prisma.disruption.create({
    //   data: {
    //     cause: GtfsData.AlertCause.ACCIDENT,
    //     effect: GtfsData.AlertCause.CONSTRUCTION,
    //     start_date: new Date(Date.now()),
    //     end_date: new Date(Date.now() + 10 * 60 * 1000),
    //     description: "Some description",
    //     routeId: "AO123",
    //     severity: GtfsData.AlertSeverity.UNKNOWN_SEVERITY,
    //     wasProcessed: false,
    //     tweet: {
    //       connect: {
    //         tweetId: "NO_ID",
    //       },
    //     },
    //   },
    // })
  }

  async getDisruptionsService(): Promise<DisruptionWithTweet[]> {
    const unprocessedDisruptions: DisruptionWithTweet[] = await (
      await this.prisma.disruption.findMany({
        include: {
          tweet: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
      })
    ).filter((e) => e.tweet.hasDisruption === true)
    await Promise.all(
      unprocessedDisruptions.map((disruption) =>
        this.prisma.disruption.update({
          where: {
            id: disruption.id,
          },
          data: {
            wasProcessed: true,
          },
        }),
      ),
    )
    // console.log(unprocessedDisruptions)
    return unprocessedDisruptions
  }

  async getUnprocessedDisruptions(): Promise<DisruptionWithTweet[]> {
    const unprocessedDisruptions: DisruptionWithTweet[] = await (
      await this.prisma.disruption.findMany({
        where: {
          wasProcessed: false,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
        include: {
          tweet: true,
        },
      })
    ).filter((e) => e.tweet.hasDisruption === true)
    await Promise.all(
      unprocessedDisruptions.map((disruption) =>
        this.prisma.disruption.update({
          where: {
            id: disruption.id,
          },
          data: {
            wasProcessed: true,
          },
        }),
      ),
    )
    return unprocessedDisruptions
  }
}
