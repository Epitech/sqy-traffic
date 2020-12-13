import { Controller, Get } from "@nestjs/common"
import { TweetSchema } from "src/model/tweet.entity"
import TrafficService from "./traffic.service"
import { version } from "../../package.json"

@Controller(`api/${version}/disruptions`)
export default class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Get()
  async getDisruptions(): Promise<TweetSchema[]> {
    return this.trafficService.getTweets()
  }
}
