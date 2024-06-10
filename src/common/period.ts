import { PeriodType } from "./enums";
import { Period } from "./model";

export const periodsdata: Period[] = [
  {
    periodType: PeriodType.TODAY,
    startDateTime: "2024-06-07T00:00:00",
    endDateTime: "2024-06-07T23:59:00",
  },
  {
    periodType: PeriodType.YESTERDAY,
    startDateTime: "2024-06-06T00:00:00",
    endDateTime: "2024-06-06T23:59:00",
  },
  {
    periodType: PeriodType.WEEKLY,
    startDateTime: "2024-06-03T00:00:00",
    endDateTime: "2024-06-09T23:59:00",
  },
  {
    periodType: PeriodType.MONTHLY,
    startDateTime: "2024-06-01T00:00:00",
    endDateTime: "2024-06-30T23:59:00",
  },
  {
    periodType: PeriodType.YEARLY,
    startDateTime: "2024-01-01T00:00:00",
    endDateTime: "2024-12-31T23:59:00",
  },
];
