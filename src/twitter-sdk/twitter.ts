import axios, { AxiosError } from "axios"
import { User } from "twitter-d"
import { API_BASE_URL, USERNAME_CHECKER, API_TOKEN } from "../../config/environnement"
import { TwitterAccounts } from "./constants"

interface TweetUrl {
  // Start of url
  start: number
  // End of url
  end: number
  // Shortened url
  url: string
  // Original url
  expanded_url: string
  // Url pic
  display_url: string
}

interface TweetMention {
  // Start of mention (including '@')
  start: number
  // End of mention
  end: number
  // Mentionned username
  username: string
}

interface TweetHashtag {
  // Start of hashtag (including '#')
  start: number
  // End of hashtag
  end: number
  tag: string
}

// If text begins with 'RT @username', it's a retweet, we can ignore it
interface Tweet {
  id: string
  // 'tweet.fields=created_at' YYYY-MM-DDTHH:mm:ss.SSSZ
  created_at: string
  text: string
  entities?: {
    mentions?: TweetMention[]
    urls?: TweetUrl[]
    hashtags?: TweetHashtag[]
  }
}

export default class Twitter {
  private URL_BASE = "https://api.twitter.com/2"

  private USERNAME_CHECKER = "POCInnovation"

  constructor(private readonly bearerToken: string | undefined) {
    this.checkCredentials()
  }

  private async request<T>(endpoint: string, params: Record<string, never> = {}): Promise<T> {
    const response = await axios({
      method: "get",
      url: `${API_BASE_URL}/${endpoint}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      params,
    })

    return response.data.data as T
  }

  private async checkCredentials(): Promise<void> {
    await this.request<User>(`users/by/username/${USERNAME_CHECKER}`)
  }

  async GetUserByUsername(username: string): Promise<User | undefined> {
    try {
      const user = await this.request<User>(`users/by/username/${username}`)
      return user
    } catch (err) {
      console.error((err as AxiosError).toJSON())
    }
    return undefined
  }

  async getTweets(username: string): Promise<Tweet[] | undefined> {
    try {
      const tweets = this.request<Tweet[]>(
        `tweets/search/recent?query=from:${username}&tweet.fields=created_at,entities`,
      )
      return tweets
    } catch (err) {
      console.error((err as AxiosError).toJSON())
    }
    return undefined
  }

  // private getTweet() {}
}
