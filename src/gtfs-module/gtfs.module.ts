import { Module } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import DisruptionService from "./disruptions.service"
import GtfsController from "./gtfs.controller"
import { GtfsService } from "./gtfs.service"

@Module({
  imports: [],
  providers: [PrismaService, GtfsService, DisruptionService],
  controllers: [GtfsController],
})
export default class GtfsModule {}
