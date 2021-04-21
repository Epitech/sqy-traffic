import { Controller, Get, Post } from "@nestjs/common"
import { Tweet } from "@prisma/client"
import { ApiProperty } from "@nestjs/swagger"
import TwitterService from "./twitter.service"
import { version } from "../../package.json"

@Controller(`api/${version}/twitter`)
export default class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @ApiProperty({ description: "Get tweets" })
  @Get()
  async getTweets(): Promise<Tweet[]> {
    return this.twitterService.getTweets()
  }

  @ApiProperty({ description: "Get tweets to be processed by the I.A." })
  @Get("processing")
  async getTweetsToBeProcessed(): Promise<Tweet[]> {
    return this.twitterService.getTweetsToBeProcessed()
  }

  // @Post("processing")
  // async addProcessedDisruptions(): Promise<void> {
  //   return this.twitterService.addProcessedDisruptions();
  // }
}
