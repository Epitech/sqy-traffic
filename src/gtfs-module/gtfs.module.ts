import { Module } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import DisruptionService from "./disruptions.service"
import { GtfsService } from "./gtfs.service"

@Module({
  imports: [],
  providers: [PrismaService, GtfsService, DisruptionService],
  controllers: [],
})
export default class GtfsModule {}
