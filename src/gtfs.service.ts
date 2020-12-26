import { Injectable } from "@nestjs/common"
// import { Disruption } from "@prisma/client"
import * as GtfsRealtimeBindings from "gtfs-realtime-bindings"
import { PrismaService } from "./prisma.service"

enum Incrementality {
  FULL_DATASET = 0,
  DIFFERENTIAL = 1,
}

enum AlertCause {
  UNKNOWN_CAUSE = 1,
  OTHER_CAUSE = 2,
  TECHNICAL_PROBLEM = 3,
  STRIKE = 4,
  DEMONSTRATION = 5,
  ACCIDENT = 6,
  HOLIDAY = 7,
  WEATHER = 8,
  MAINTENANCE = 9,
  CONSTRUCTION = 10,
  POLICE_ACTIVITY = 11,
  MEDICAL_EMERGENCY = 12,
}

enum AlertEffect {
  NO_SERVICE = 1,
  REDUCED_SERVICE = 2,
  SIGNIFICANT_DELAYS = 3,
  DETOUR = 4,
  ADDITIONAL_SERVICE = 5,
  MODIFIED_SERVICE = 6,
  OTHER_EFFECT = 7,
  UNKNOWN_EFFECT = 8,
  STOP_MOVED = 9,
  NO_EFFECT = 10,
}

enum AlertSeverity {
  UNKNOWN_SEVERITY = 1,
  INFO = 2,
  WARNING = 3,
  SEVERE = 4,
}

interface Disruption {
  // Id of the line affected by the disruption
  route_id?: number
  // Id of the entitity affected by the disruption
  entity_id?: number
  // Start_date
}

@Injectable()
export class GtfsService {
  constructor(private prisma: PrismaService) {}

  async convertDisruptionToEntity(disruption: Disruption) {

  }

  async getUnprocessedDisruption(): Promise<Buffer> {
    const headerTemplate = {
      gtfsRealtimeVersion: "2.0",
      incrementality: "DIFFERENTIAL",
      timestamp: Math.floor(new Date(Date.now()).getTime() / 1000).toString(),
    }
    const message = GtfsRealtimeBindings.transit_realtime.FeedMessage.fromObject()
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
