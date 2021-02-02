import { Module } from "@nestjs/common"
import DisruptionService from "src/gtfs-module/disruptions.service"
import GtfsModule from "src/gtfs-module/gtfs.module"
import { GtfsService } from "src/gtfs-module/gtfs.service"
import { PrismaService } from "../prisma.service"
import TrafficController from "./traffic.controller"
import TrafficService from "./traffic.service"

@Module({
  imports: [GtfsModule],
  controllers: [TrafficController],
  providers: [TrafficService, GtfsService, PrismaService, DisruptionService],
})
export default class TrafficModule {}
