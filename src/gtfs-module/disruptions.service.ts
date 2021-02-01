import { Injectable } from "@nestjs/common"
import { Disruption } from "@prisma/client"
import { PrismaService } from "src/prisma.service"

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
    //         tweetId: "ID",
    //       },
    //     },
    //   },
    // })
  }

  async getUnprocessedDisruptions(): Promise<Disruption[]> {
    return this.prisma.disruption.findMany({
      where: {
        wasProcessed: false,
      },
      include: {
        tweet: true,
      },
    })
  }
}
