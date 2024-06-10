export enum Mode {
  CREATE = "CREATE",
  EDIT = "EDIT",
  VIEW = "VIEW",
}

export enum Layout {
  AUTH = "/auth",
  ADMIN = "/administration",
  DASHBOARD = "/dashboard",
  STATIONNEX = "/stationnex-card",
}

export enum ModeAffectation {
  MANUEL = "MANUEL",
  AUTOMATIC = "AUTOMATIQUE",
}

export enum ShiftExecutionStatus {
  WAITING = "WAITING",
  LOCKED = "LOCKED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum PlanificationMode {
  AUTO = "AUTO",
  MANUEL = "MANUEL",
}

export enum SheetStatus {
  INITIATED = "INITIATED",
  SOLDED = "SOLDED",
  FORCED = "FORCED",
}

export enum PeriodType {
  NONE = "NONE",
  TODAY = "today",
  YESTERDAY = "yesterday",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}
