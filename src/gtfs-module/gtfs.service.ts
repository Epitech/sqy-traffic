import { Injectable } from "@nestjs/common"
import { Disruption } from "@prisma/client"
import * as GtfsRealtimeBindings from "gtfs-realtime-bindings"
import { PrismaService } from "../prisma.service"
import DisruptionService from "./disruptions.service"
import * as GtfsData from "./gtfs.data"

@Injectable()
export class GtfsService {
  constructor(private prisma: PrismaService, private disruptionService: DisruptionService) {}

  determineDeletion(severity: GtfsData.AlertSeverity): boolean {
    // Choose how to deletion (we have the whole line in the Disruption)
    return severity === GtfsData.AlertSeverity.SEVERE
  }

  async convertDisruptionToAlert(disruption: GtfsData.DisruptionWithTweet): Promise<GtfsData.ServiceAlert> {
    const alertBuilder: GtfsData.ServiceAlert = {}

    alertBuilder.serverityLevel = disruption.severity ?? GtfsData.AlertSeverity.UNKNOWN_SEVERITY
    alertBuilder.cause = <any>disruption.cause
    alertBuilder.effect = <any>disruption.effect
    alertBuilder.url = [{ language: "fr", text: disruption.tweet?.tweetUrl ?? "NO_URL" }]
    alertBuilder.description = [{ language: "fr", text: disruption.tweet.text }]
    if (disruption.start_date || disruption.end_date) {
      alertBuilder.activePeriod = [{ start: disruption.start_date.getTime(), end: disruption.end_date.getTime() }]
    }

    // From analysis conclusion, check which ways are disrupted from Mapper to get the informed entity (route_id?,  stop_id ?)
    alertBuilder.informedEntity = [
      {
        routeId: disruption.routeId,
      },
    ]

    return alertBuilder
  }

  async createFeedEntity(twitter_id: string | null, disruption: GtfsData.DisruptionWithTweet): Promise<any> {
    try {
      // The Id of the entity may be the known on the netwo
      const entityBuilder: GtfsData.EntityBuilder = {
        id: twitter_id ?? "NO_ID",
        isDeleted: this.determineDeletion(disruption.severity),
      }

      entityBuilder.alert = await this.convertDisruptionToAlert(disruption)
      return GtfsRealtimeBindings.transit_realtime.FeedEntity.fromObject(entityBuilder)
    } catch (e) {
      console.log(e)
    }
    return null
  }

  async getEncodedDisruptions(): Promise<Buffer> {
    // Need to get Disruptions from Databases

    const disruptions: GtfsData.DisruptionWithTweet[] = await this.disruptionService.getUnprocessedDisruptions()
    // Header du message GTFS-RT
    const headerTemplate = {
      gtfsRealtimeVersion: "2.0",
      incrementality: GtfsData.Incrementality.FULL_DATASET,
      timestamp: Math.floor(new Date(Date.now()).getTime() / 1000).toString(),
    }
    // Construction des FeedEntity
    const entities = await Promise.all(
      disruptions.map((disruption) => {
        return this.createFeedEntity(disruption.tweet.tweetId, disruption)
      }),
    )
    const messageObject = {
      header: headerTemplate,
      entity: entities,
    }
    const message = GtfsRealtimeBindings.transit_realtime.FeedMessage.fromObject(messageObject)
    console.log(GtfsRealtimeBindings.transit_realtime.FeedMessage.verify(message)) // if null -> GOOOD
    return GtfsRealtimeBindings.transit_realtime.FeedMessage.encode(message, null).finish()
  }
}
