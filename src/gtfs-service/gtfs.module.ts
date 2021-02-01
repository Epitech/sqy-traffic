import { Module } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import { GtfsService } from "./gtfs.service"

@Module({
  imports: [],
  providers: [PrismaService, GtfsService],
  controllers: [],
})
export default class GtfsModule {}
