import { Controller, Get, Post } from "@nestjs/common"
import { Tweet } from "@prisma/client"
import TwitterService from "./twitter.service"
import { version } from "../../package.json"

@Controller(`api/${version}/twitter`)
export default class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @Get()
  async getTweets(): Promise<Tweet[]> {
    return this.twitterService.getTweets()
  }

  @Get("processing")
  async getTweetsToBeProcessed(): Promise<Tweet[]> {
    return this.twitterService.getTweetsToBeProcessed()
  }

  // @Post("processing")
  // async addProcessedDisruptions(): Promise<void> {
  //   return this.twitterService.addProcessedDisruptions();
  // }
}
