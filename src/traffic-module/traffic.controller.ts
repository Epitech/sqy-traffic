import { Request, Response } from 'express';
import TrafficService from './traffic.service';

export default class TrafficController {
	constructor(private readonly trafficService: TrafficService) {}

	async getDisruptions(req: Request, res: Response): Promise<void> {
        console.log(req);
        console.log(res);
        res.status(200).send("GET /api/0.0.1/disruptions");
    }
}
