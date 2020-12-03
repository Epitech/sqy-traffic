import querystring from 'querystring';
import axios from 'axios';
import { Status as Tweet, User } from 'twitter-d';

export default class Twitter {
	private URL_BASE = 'https://api.twitter.com/2';

	private USERNAME_CHECKER = 'Pr0m3th3usE';

	constructor(private readonly bearerToken: string | undefined) {
		this.checkCredentials();
	}

	private async request<T>(endpoint: string, params: any = {}): Promise<T> {
		const response = await axios({
			method: 'get',
			url: `${this.URL_BASE}/${endpoint}`,
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${this.bearerToken}`,
			},
			params,
		});

		return response.data.data as T;
	}

	private async checkCredentials(): Promise<void> {
		await this.request<User>(`users/by/username/${this.USERNAME_CHECKER}`);
	}

	async GetUserByUsername(username: string): Promise<User | undefined> {
		try {
			const user = await this.request<User>(`users/by/username/${username}`);
			return user;
		} catch (err) {
			console.log(err.toJSON());
		}
		return undefined;
	}

	// private getTweet() {}

	// private getTweets() {}
}
