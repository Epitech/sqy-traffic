import { Request, Response } from "express"
import TrafficService from "./traffic.service"

export default class TrafficController {
  async getDisruptions(req: Request, res: Response): Promise<void> {
    const trafficService = TrafficService.getInstance()
  }
}
