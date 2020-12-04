import express from "express"
import { version } from "../../package.json"
import TrafficController from "./traffic.controller"
import TrafficService from "./traffic.service"

export default class TrafficModule {
  private trafficController: TrafficController

  constructor() {
    this.trafficController = new TrafficController()
    TrafficService.getInstance()
  }

  initializeRoutes(app: express.Application): void {
    app.route(`/api/${version}/disruptions`).get(this.trafficController.getDisruptions)
  }
}
