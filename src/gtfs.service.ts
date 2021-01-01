import { Injectable } from "@nestjs/common"
// import { Disruption } from "@prisma/client"
import * as GtfsRealtimeBindings from "gtfs-realtime-bindings"
import { PrismaService } from "./prisma.service"

enum Incrementality {
  FULL_DATASET = "FULL_DATASET",
  DIFFERENTIAL = "DIFFERENTIAL",
}

enum AlertCause {
  UNKNOWN_CAUSE = "UNKNOWN_CAUSE",
  OTHER_CAUSE = "OTHER_CAUSE",
  TECHNICAL_PROBLEM = "TECHNICAL_PROBLEM",
  STRIKE = "STRIKE",
  DEMONSTRATION = "DEMONSTRATION",
  ACCIDENT = "ACCIDENT",
  HOLIDAY = "HOLIDAY",
  WEATHER = "WEATHER",
  MAINTENANCE = "MAINTENANCE",
  CONSTRUCTION = "CONSTRUCTION",
  POLICE_ACTIVITY = "POLICE_ACTIVITY",
  MEDICAL_EMERGENCY = "MEDICAL_EMERGENCY",
}

enum AlertEffect {
  NO_SERVICE = "NO_SERVICE",
  REDUCED_SERVICE = "REDUCED_SERVICE",
  SIGNIFICANT_DELAYS = "SIGNIFICANT_DELAYS",
  DETOUR = "DETOUR",
  ADDITIONAL_SERVICE = "ADDITIONAL_SERVICE",
  MODIFIED_SERVICE = "MODIFIED_SERVICE",
  OTHER_EFFECT = "OTHER_EFFECT",
  UNKNOWN_EFFECT = "UNKNOWN_EFFECT",
  STOP_MOVED = "STOP_MOVED",
  NO_EFFECT = "NO_EFFECT",
}

enum AlertSeverity {
  UNKNOWN_SEVERITY = 1,
  INFO = 2,
  WARNING = 3,
  SEVERE = 4,
}

interface Disruption {
  // Id of the line affected by the disruption
  routeId?: string
  // Start_date timestamp
  start_date: number
  // End_date timestamp
  end_date?: number
  // cause
  cause?: AlertCause
  // effect
  effect?: AlertEffect
  // severity
  severityLevel?: AlertSeverity
}

interface Entity {
  // Whole agency disturbed
  agencyId?: string
  // Which route
  routeId?: string
  // Specific trip on a route
  trip?: string
  // Specific stop on a route
  stopId?: string
}

interface AlertPeriod {
  start: number
  end: number
}

interface Translation {
  language: string

  text: string
}

interface ServiceAlert {
  // Periods Affected by the Disruption
  activePeriod?: AlertPeriod[]
  // cause
  cause: AlertCause
  // effect
  effect: AlertEffect
  // severity
  serverityLevel: AlertSeverity
  // networks affected by the disruption
  informedEntity: Entity[]
  // url of tweet for information
  url?: Translation[]
}

interface EntityBuilder {
  // Id of the entity (vehicule, train...)
  id: string
  // Is entity deleted ?
  isDeleted?: boolean
  // Information of the alert
  alert?: ServiceAlert
}

@Injectable()
export class GtfsService {
  constructor(private prisma: PrismaService) {}

  async determineDeletion(alert: ServiceAlert): Promise<boolean> {
    return false
  }

  async convertDisruptionToAlert(disruption: Disruption): Promise<ServiceAlert> {
    return {
      cause: AlertCause.UNKNOWN_CAUSE,
      effect: AlertEffect.UNKNOWN_EFFECT,
      serverityLevel: AlertSeverity.UNKNOWN_SEVERITY,
      informedEntity: [],
    }
  }

  async createFeedEntity(twitter_id: string, disruption: Disruption): Promise<any> {
    try {
      const entityBuilder: EntityBuilder = { id: twitter_id, isDeleted: false }

      entityBuilder.alert = await this.convertDisruptionToAlert(disruption)
      entityBuilder.isDeleted = await this.determineDeletion(entityBuilder.alert)
      return GtfsRealtimeBindings.transit_realtime.FeedEntity.fromObject(entityBuilder)
    } catch (e) {
      console.log(e)
    }
    return null
  }

  async getUnprocessedDisruption(): Promise<Buffer> {
    const disruptions: Disruption[] = [
      {
        routeId: "231",
        start_date: 13465762879,
        end_date: 13465862879,
        cause: AlertCause.ACCIDENT,
        effect: AlertEffect.DETOUR,
        severityLevel: AlertSeverity.INFO,
      },
    ]

    const headerTemplate = {
      gtfsRealtimeVersion: "2.0",
      incrementality: Incrementality.FULL_DATASET,
      timestamp: Math.floor(new Date(Date.now()).getTime() / 1000).toString(),
    }
    const entities = []
    for (const disruption of disruptions) {
      entities.push(await this.createFeedEntity("TWITTER_ID", disruption))
    }
    const messageObject = {
      header: headerTemplate,
      entity: entities.filter((e) => e),
    }
    const message = GtfsRealtimeBindings.transit_realtime.FeedMessage.fromObject(messageObject)
    console.log(message)
    return GtfsRealtimeBindings.transit_realtime.FeedMessage.encode(message, null).finish()
  }
}
/**
 * Disruption:
 * - Entity affected
 * - trip_id / route_id
 * - begin_date
 * - end_date (facultatif)
 * - cause
 * - effect
 */
