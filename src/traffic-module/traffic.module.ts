import { Module } from "@nestjs/common"
import GtfsModule from "src/gtfs-service/gtfs.module"
import { GtfsService } from "src/gtfs-service/gtfs.service"
import { PrismaService } from "../prisma.service"
import TrafficController from "./traffic.controller"
import TrafficService from "./traffic.service"

@Module({
  imports: [GtfsModule],
  controllers: [TrafficController],
  providers: [TrafficService, GtfsService, PrismaService],
})
export default class TrafficModule {}
