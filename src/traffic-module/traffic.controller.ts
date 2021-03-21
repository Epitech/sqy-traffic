import { Controller, Get, Header, HttpException, HttpStatus, Res } from "@nestjs/common"
import { ApiProperty } from "@nestjs/swagger"
import { Response } from "express"
import { Readable } from "stream"
import TrafficService from "./traffic.service"
import { version } from "../../package.json"
import { GtfsService } from "../gtfs-module/gtfs.service"

@Controller(`api/${version}/disruptions`)
export default class TrafficController {
  constructor(private readonly trafficService: TrafficService, private readonly gtfsService: GtfsService) {}

  @ApiProperty({ description: "Transform unprocessed tweets to gtfs-rt format" })
  @Get()
  @Header("Content-Type", "application/octet-stream")
  async getDisruptions(@Res() res: Response): Promise<void> {
    const encodedDisruptions: Buffer = await this.gtfsService.getEncodedDisruptions()
    if (!encodedDisruptions) {
      throw new HttpException("Not Modified", HttpStatus.NOT_MODIFIED)
    }
    res.set({
      "Content-Length": encodedDisruptions.length,
    })
    const readable = new Readable()
    readable.push(encodedDisruptions)
    readable.push(null)
    readable.pipe(res)
  }
}
