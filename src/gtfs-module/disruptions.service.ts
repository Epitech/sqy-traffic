import { Injectable } from "@nestjs/common"
import { Disruption } from "@prisma/client"
import { PrismaService } from "src/prisma.service"

@Injectable()
export default class DisruptionService {
  constructor(private prisma: PrismaService) {}

  async storeNewDisruptions(): Promise<void> {
    console.log("Storing new disruptions found!")
  }

  async getUnprocessedDisruptions(): Promise<Disruption[]> {
    // const dist = await this.prisma.disruption.findFirst()
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
