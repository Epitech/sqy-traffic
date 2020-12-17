import { Injectable } from "@nestjs/common"
import { Disruption } from "@prisma/client"
import Twitter from "../twitter-sdk"
import { API_TOKEN } from "../../config/environnement"
import { PrismaService } from "../prisma.service"

@Injectable()
export default class TrafficService {
  private readonly twitter: Twitter

  constructor(private prisma: PrismaService) {
    this.twitter = new Twitter(API_TOKEN)
  }

  async getDisruptions(): Promise<Disruption[]> {
    return this.prisma.disruption.findMany()
  }
}
