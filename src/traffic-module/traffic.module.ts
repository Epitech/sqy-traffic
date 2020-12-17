import { Module } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import TrafficController from "./traffic.controller"
import TrafficService from "./traffic.service"

@Module({
  imports: [],
  controllers: [TrafficController],
  providers: [TrafficService, PrismaService],
})
export default class TrafficModule {}
