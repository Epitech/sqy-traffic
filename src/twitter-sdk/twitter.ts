import axios, { AxiosError } from "axios"
import { API_BASE_URL, USERNAME_CHECKER, API_TOKEN } from "../../config/environnement"

interface User {
  // id of the user
  id: string
  // Full Name of the user
  name: string
  // Username of the user
  username: string
}

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
  // 'tweet.fields=entities'
  entities?: {
    mentions?: TweetMention[]
    urls?: TweetUrl[]
    hashtags?: TweetHashtag[]
  }
}

interface GetTweetsQuery {
  sinceId?: string
  maxResults?: number
}

interface TweetsMeta {
  // tweet id
  newest_id: string
  // tweet id
  oldest_id: string
  // tweet count
  result_count: number
  // token for pagination (&next_token=${meta.next_token})
  next_token?: string
}

export default class Twitter {
  private URL_BASE = "https://api.twitter.com/2"

  private USERNAME_CHECKER = "POCInnovation"

  constructor(private readonly bearerToken: string | undefined) {
    this.checkCredentials()
  }

  private async request<T, U>(endpoint: string, params: Record<string, never> = {}): Promise<{ data: T; meta: U }> {
    const response = await axios({
      method: "get",
      url: `${API_BASE_URL}/${endpoint}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      params,
    })

    return response.data
  }

  private async checkCredentials(): Promise<void> {
    await this.request<User, undefined>(`users/by/username/${USERNAME_CHECKER}`)
  }

  async GetUserByUsername(username: string): Promise<User | undefined> {
    try {
      const { data: user } = await this.request<User, undefined>(`users/by/username/${username}`)
      return user
    } catch (err) {
      console.error((err as AxiosError).toJSON())
    }
    return undefined
  }

  async getTweets(username: string, queryParams: GetTweetsQuery): Promise<Tweet[] | undefined> {
    let formattedQuery = `query=from:${username}&tweet.fields=created_at,entities`
    if (queryParams.maxResults) {
      formattedQuery += `&max_results=${queryParams.maxResults}`
    }
    if (queryParams.sinceId) {
      formattedQuery += `&since_id=${queryParams.sinceId}`
    }
    try {
      // Todo: handle pagination
      const { data: tweets } = await this.request<Tweet[], TweetsMeta>(`tweets/search/recent?${formattedQuery}`)
      return tweets
    } catch (err) {
      console.error(err as AxiosError)
    }
    return undefined
  }

  // private getTweet() {}
}
