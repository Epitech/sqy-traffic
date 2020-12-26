import { Controller, Get, Header, HttpException, HttpStatus } from "@nestjs/common"
import TrafficService from "./traffic.service"
import { version } from "../../package.json"
import { GtfsService } from "../gtfs.service"

@Controller(`api/${version}/disruptions`)
export default class TrafficController {
  constructor(private readonly trafficService: TrafficService, private readonly gtfsService: GtfsService) {}

  @Get()
  @Header("Content-Type", "application/octet-stream")
  async getDisruptions(): Promise<Buffer> {
    const encodedDisruptions = this.gtfsService.getUnprocessedDisruption()
    if (!encodedDisruptions) {
      throw new HttpException("Not Modified", HttpStatus.NOT_MODIFIED)
    }
    return encodedDisruptions
  }
}
