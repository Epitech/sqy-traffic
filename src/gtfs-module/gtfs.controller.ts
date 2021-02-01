import { Controller, Post } from "@nestjs/common"
import { version } from "../../package.json"
import DisruptionService from "./disruptions.service"
import { GtfsService } from "./gtfs.service"

@Controller(`api/${version}/disruptions/push`)
export default class GtfsController {
  constructor(private gtfsService: GtfsService, private disruptionService: DisruptionService) {}

  @Post("")
  async pushDisruptionTest(): Promise<void> {
    await this.disruptionService.storeNewDisruptions()
  }
}
