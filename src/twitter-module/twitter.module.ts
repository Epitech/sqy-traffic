import { Module } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import TwitterController from "./twitter.controller"
import TwitterService from "./twitter.service"

@Module({
  imports: [],
  controllers: [TwitterController],
  providers: [TwitterService, PrismaService],
})
export default class TwitterModule {}
