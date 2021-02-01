import { Injectable } from "@nestjs/common"
// import { Disruption } from "@prisma/client"
import * as GtfsRealtimeBindings from "gtfs-realtime-bindings"
import { PrismaService } from "../prisma.service"
import * as GtfsData from "./gtfs.data"

@Injectable()
export class GtfsService {
  constructor(private prisma: PrismaService) {}

  async determineDeletion(alert: GtfsData.ServiceAlert): Promise<boolean> {
    // Choose how to deletion (we have the whole line in the Disruption)
    return false
  }

  async convertDisruptionToAlert(disruption: GtfsData.Disruption): Promise<GtfsData.ServiceAlert> {
    const alertBuilder: GtfsData.ServiceAlert = {}

    alertBuilder.serverityLevel = disruption.severityLevel ?? GtfsData.AlertSeverity.UNKNOWN_SEVERITY
    alertBuilder.cause = disruption.cause ?? GtfsData.AlertCause.UNKNOWN_CAUSE
    alertBuilder.effect = disruption.effect ?? GtfsData.AlertEffect.UNKNOWN_EFFECT
    alertBuilder.url = [{ language: "fr", text: disruption.tweetURL }]
    alertBuilder.description = [{ language: "fr", text: disruption.description ?? "" }]
    if (disruption.start_date || disruption.end_date) {
      alertBuilder.activePeriod = [{ start: disruption.start_date, end: disruption.end_date }]
    }

    // From analysis conclusion, check which ways are disrupted from Mapper to get the informed entity (route_id?,  stop_id ?)
    alertBuilder.informedEntity = [
      {
        routeId: disruption.routeId,
      },
    ]

    return alertBuilder
  }

  async createFeedEntity(twitter_id: string, disruption: GtfsData.Disruption): Promise<any> {
    try {
      // The Id of the entity may be the known on the netwo
      const entityBuilder: GtfsData.EntityBuilder = { id: twitter_id, isDeleted: false }

      entityBuilder.alert = await this.convertDisruptionToAlert(disruption)
      entityBuilder.isDeleted = await this.determineDeletion(entityBuilder.alert)
      return GtfsRealtimeBindings.transit_realtime.FeedEntity.fromObject(entityBuilder)
    } catch (e) {
      console.log(e)
    }
    return null
  }

  async getEncodedDisruptions(): Promise<Buffer> {
    // Need to get Disruptions from Databases

    // const disruptions =

    const disruptions: GtfsData.Disruption[] = [
      {
        routeId: "1020C",
        tweetId: "TWEET_ID",
        tweetURL: "TWEET_URL",
        start_date: 13465762879,
        end_date: 13465862879,
        cause: GtfsData.AlertCause.ACCIDENT,
        effect: GtfsData.AlertEffect.DETOUR,
        severityLevel: GtfsData.AlertSeverity.INFO,
        description: "Some description of the alert from tweet text",
      },
    ]
    // Header du message GTFS-RT
    const headerTemplate = {
      gtfsRealtimeVersion: "2.0",
      incrementality: GtfsData.Incrementality.FULL_DATASET,
      timestamp: Math.floor(new Date(Date.now()).getTime() / 1000).toString(),
    }
    // Construction des FeedEntity
    const entities = []
    for (const disruption of disruptions) {
      entities.push(await this.createFeedEntity(disruption.tweetId, disruption))
    }
    const messageObject = {
      header: headerTemplate,
      entity: entities.filter((e) => e),
    }
    const message = GtfsRealtimeBindings.transit_realtime.FeedMessage.fromObject(messageObject)
    console.log(GtfsRealtimeBindings.transit_realtime.FeedMessage.verify(message)) // if null -> GOOOD
    return GtfsRealtimeBindings.transit_realtime.FeedMessage.encode(message, null).finish()
  }
}
