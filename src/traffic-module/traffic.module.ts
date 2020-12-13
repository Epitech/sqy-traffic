import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TweetSchema } from "../model/tweet.entity"
import TrafficController from "./traffic.controller"
import TrafficService from "./traffic.service"

@Module({
  imports: [TypeOrmModule.forFeature([TweetSchema])],
  controllers: [TrafficController],
  providers: [TrafficService],
})
export default class TrafficModule {}
