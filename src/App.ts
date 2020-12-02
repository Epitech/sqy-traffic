import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { TrafficModule } from './traffic-module';

export default class App {
	private port: number;

	private readonly trafficModule: TrafficModule;

	private appbase: express.Application;

	constructor() {
		this.port = 3000;
		this.appbase = express();
		this.trafficModule = new TrafficModule();

		this.configureRootMiddlewares();
		this.applyRoutes();
	}

	configureRootMiddlewares(): void {
		this.appbase.use(helmet());
		this.appbase.use(cors());
	}

	applyRoutes(): void {
		this.trafficModule.initializeRoutes(this.appbase);
	}

	async start(): Promise<void> {
		this.appbase.listen(this.port, () => {
			console.log(`Realtime Disruption API: listening on port ${this.port}`);
		});
	}
}
