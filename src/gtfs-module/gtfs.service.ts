import { Injectable } from "@nestjs/common"
import * as GtfsRealtimeBindings from "gtfs-realtime-bindings"
import { PrismaService } from "../prisma.service"
import DisruptionService from "./disruptions.service"
import { ENV } from "../../config/environnement"
import { DisruptionWithTweet, ServiceAlert, AlertSeverity, EntityBuilder, Incrementality, TimeRange } from "./gtfs.data"

@Injectable()
export class GtfsService {
  constructor(private prisma: PrismaService, private disruptionService: DisruptionService) {}

  determineDeletion(severity: AlertSeverity): boolean {
    // Choose how to deletion (we have the whole line in the Disruption)
    return severity === AlertSeverity.SEVERE
  }

  async convertDisruptionToAlert(disruption: DisruptionWithTweet): Promise<ServiceAlert> {
    const alertBuilder: ServiceAlert = {}

    alertBuilder.serverityLevel = disruption.severity ?? AlertSeverity.UNKNOWN_SEVERITY
    alertBuilder.cause = <any>disruption.cause
    alertBuilder.effect = <any>disruption.effect
    alertBuilder.url = { translation: [{ language: "fr", text: disruption.tweet.tweetUrl ?? "NO_URL" }] }
    alertBuilder.descriptionText = { translation: [{ language: "fr", text: disruption.tweet.text }] }
    alertBuilder.headerText = {
      translation: [
        {
          language: "fr",
          text:
            disruption.routeId.slice("https://twitter.com/".length, disruption.routeId.length) +
            disruption.createdAt.toString(),
        },
      ],
    }
    // console.log(disruption.routeId.slice("https://twitter.com/".length, disruption.routeId.length) + disruption.createdAt.toString())
    if (disruption.start_date || disruption.end_date) {
      alertBuilder.activePeriod = [
        { start: disruption.start_date.getTime() / 1000, end: disruption.end_date.getTime() / 1000 + 3 * 3600 },
      ]
    }

    // From analysis conclusion, check which ways are disrupted from Mapper to get the informed entity (route_id?,  stop_id ?)
    alertBuilder.informedEntity = [
      {
        routeId: disruption.routeId,
      },
    ]
    return alertBuilder
  }

  async createFeedEntity(twitter_id: string | null, disruption: DisruptionWithTweet): Promise<any> {
    try {
      // The Id of the entity may be the known on the netwo
      const entityBuilder: EntityBuilder = {
        id: twitter_id ?? "NO_ID",
        isDeleted: this.determineDeletion(disruption.severity),
        alert: await this.convertDisruptionToAlert(disruption),
      }

      return GtfsRealtimeBindings.transit_realtime.FeedEntity.fromObject(entityBuilder)
    } catch (e) {
      console.log(e)
    }
    return null
  }

  async getEncodedDisruptions(): Promise<Buffer> {
    // Need to get Disruptions from Databases

    const disruptions: DisruptionWithTweet[] =
      ENV === "PROD"
        ? await this.disruptionService.getUnprocessedDisruptions()
        : await this.disruptionService.getDisruptionsService()

    // Header du message GTFS-RT
    const headerTemplate = {
      gtfsRealtimeVersion: "2.0",
      incrementality: Incrementality.FULL_DATASET,
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
