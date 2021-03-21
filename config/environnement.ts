import { from, logger } from "env-var"
import { config } from "dotenv"

config()

const debugged = from(process.env, {}, logger)
const env = (name: string, required = true) => debugged.get(name).required(required)

export const API_TOKEN = env("TW_BEARER_TOKEN").asString()
export const API_BASE_URL = env("TW_API_URL").asString()
export const USERNAME_CHECKER = env("USERNAME_CHECKER").asString()
export const PORT = env("PORT", false).default(3000).asPortNumber()
export const INTERVAL_TWEET = env("INTERVAL_TWEET").asInt()
export const ENV = env("ENV").asString()
