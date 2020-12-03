import { User } from 'twitter-d';
import Twitter from '../twitter-sdk/twitter';

export default class TrafficService {
	private T: Twitter;

	private static instance: TrafficService | undefined = undefined;

	private constructor() {
		this.T = new Twitter(process.env.TW_BEARER_TOKEN);
	}

	async getUser(username: string): Promise<void> {
		const user = await this.T.GetUserByUsername("PoCInnovation");
		console.log(user);
	}

	static getInstance(): TrafficService {
		if (!this.instance) {
			this.instance = new TrafficService();
		}
		return this.instance;
	}
}
