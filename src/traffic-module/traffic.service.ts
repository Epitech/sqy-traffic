import { Injectable } from "@nestjs/common"
import Twitter from "../twitter-sdk/twitter"
import { API_TOKEN } from "../../config/environnement"

@Injectable()
export default class TrafficService {
  private T: Twitter

  constructor() {
    this.T = new Twitter(API_TOKEN)
  }
}
