import { Module } from "@nestjs/common"
import { GtfsService } from "../gtfs.service"
import { PrismaService } from "../prisma.service"
import TrafficController from "./traffic.controller"
import TrafficService from "./traffic.service"

@Module({
  imports: [],
  controllers: [TrafficController],
  providers: [TrafficService, GtfsService, PrismaService],
})
export default class TrafficModule {}
