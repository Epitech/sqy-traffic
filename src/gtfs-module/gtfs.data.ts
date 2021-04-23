export enum Incrementality {
  FULL_DATASET = "FULL_DATASET",
  DIFFERENTIAL = "DIFFERENTIAL",
}

export enum AlertCause {
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

export enum AlertEffect {
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

export enum AlertSeverity {
  UNKNOWN_SEVERITY = 1,
  INFO = 2,
  WARNING = 3,
  SEVERE = 4,
}

export interface Entity {
  // Whole agency disturbed
  agencyId?: string
  // Which route
  routeId?: string
  // Specific trip on a route
  trip?: string
  // Specific stop on a route
  stopId?: string
}

export interface AlertPeriod {
  start?: number
  end?: number
}

export interface Translation {
  language: string

  text?: string
}

export interface ServiceAlert {
  // Periods Affected by the Disruption
  activePeriod?: AlertPeriod[]
  // cause
  cause?: AlertCause
  // effect
  effect?: AlertEffect
  // severity
  serverityLevel?: AlertSeverity
  // networks affected by the disruption
  informedEntity?: Entity[]
  // url of tweet as information
  url?: Translation[]
  // description for some detials
  description_text?: Translation[]
  active_period?: TimeRange
  header_text?: Translation[]
}

export interface EntityBuilder {
  // Id of the entity (vehicule, train...)
  id: string
  // Is entity deleted ?
  isDeleted?: boolean
  // Information of the alert
  alert?: ServiceAlert
}

export interface TimeRange {
  start: number
  end: number
}

/**
 * Model Tweet
 */

export interface Tweet {
  id: string
  tweetId: string
  tweetUrl: string
  text: string
  postedAt: Date
  hasDisruption: boolean
  authorId: string
  createdAt: Date
}

/**
 * Model Disruption
 */

export interface DisruptionWithTweet {
  id: string
  tweetId: string
  routeId: string
  start_date: Date
  end_date: Date
  cause: string
  effect: string
  severity: number
  description: string
  wasProcessed: boolean
  createdAt: Date
  tweet: Tweet
}
