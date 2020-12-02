import express from 'express';
import { version } from '../../package.json';
import TrafficController from './traffic.controller';
import TrafficService from './traffic.service';

export default class TrafficModule {
	private trafficController: TrafficController;

	private trafficService: TrafficService;

	constructor() {
		this.trafficService = new TrafficService();
		this.trafficController = new TrafficController(this.trafficService);
	}

	initializeRoutes(app: express.Application): void {
		app.route(`/api/${version}/disruptions`).get(this.trafficController.getDisruptions);
	}
}
