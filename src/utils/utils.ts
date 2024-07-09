import { DecodedToken, PlanningExecution, User } from "common/model";
import jwt_decode from "jwt-decode";
import { chain } from "lodash";

import moment, { Moment } from "moment";

export const decodeToken = (token: string | null): User | null => {
  if (!token) {
    return null;
  }

  const {
    sid,
    family_name,
    given_name,
    preferred_username,
    realm_access,
    email,
    exp,
    phone,
    name,
    customerAccountId,
  } = jwt_decode<DecodedToken>(token);

  const user: User = {
    id: sid,
    phone: phone,
    name: name,
    firstName: given_name,
    lastName: family_name,
    username: preferred_username,
    role: realm_access.roles[0],
    token: token || "",
    email,
    expireTime: exp * 1000,
    customerAccountId: customerAccountId,
  };

  return user;
};

export const formatDate = (dateTimeStart: string): string => {
  return new Date(dateTimeStart).toLocaleString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const formatNumber = (value: number) => {
  return Number(value).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
export const formatNumbeer = (value: number) => {
  return parseFloat(value.toFixed(2));
};
export const formatAmount = (value: number) => {
  const locale = "en-US";
  return value.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const getColorForTankLevel = (level: number): string => {
  if (level >= 90) {
    return "#07C100";
  } else if (level >= 60) {
    return "#1FC32F";
  } else if (level >= 50) {
    return "#EAA817";
  } else if (level >= 30) {
    return "#EA8B17";
  } else {
    return "#E02200";
  }
};

export const createPeriod = (period: string) => {
  let fromDate: Moment = moment();
  let toDate: Moment = moment();

  switch (period) {
    case "today":
      fromDate = moment();
      toDate = moment();

      break;
    case "yesterday":
      fromDate = moment().subtract(1, "day");
      toDate = moment().subtract(1, "day");

      break;
    case "weekly":
      fromDate = moment().startOf("week");
      toDate = moment().endOf("week");

      break;
    case "monthly":
      fromDate = moment().startOf("month");
      toDate = moment().endOf("month");

      break;
    case "yearly":
      fromDate = moment().startOf("year");
      toDate = moment().endOf("year");

    default:
      break;
  }

  let formattedFromDate = fromDate.hour(0).minute(0).format("YYYY-MM-DDTHH:mm");
  let formattedToDate = toDate.hour(23).minute(59).format("YYYY-MM-DDTHH:mm");

  return {
    fromDate: formattedFromDate,
    toDate: formattedToDate,
  };
};

export const truncateText = (text: string, limit: number) => {
  if (text.length <= limit) {
    return text;
  } else {
    return text.slice(0, limit) + "...";
  }
};

export function groupBy<T extends Record<string, any>>(
  array: T[] | null,
  key: keyof T,
): Record<string, T[]> {
  if (!array) {
    return {};
  }
  return array.reduce((result, obj) => {
    const groupKey = obj[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(obj);
    return result;
  }, {} as Record<string, T[]>);
}

export const isToday = (day: string | Moment) => {
  return moment(day).isSame(moment().format("YYYY-MM-DD"));
};

export const isPast = (day: string | Moment) => {
  return moment(day).isBefore(moment().format("YYYY-MM-DD"));
};

export const isFuture = (day: string | Moment) => {
  return moment(day).isAfter(moment().format("YYYY-MM-DD"));
};

export const formatTime = (time: string | Moment) => {
  return moment(time, "HH:mm:ss").format("HH:mm");
};

export const getTimeFromLocalDateTime = (
  localDateTime: string | Moment,
): string => {
  return moment(localDateTime, "YYYY-MM-DDTHH:mm:ss").format("HH:mm");
};

export const calculateRowSpan = (element: any) => {
  let sum = 0;

  if (!element.items) sum = 1;
  else
    element.items.forEach((item: any) => {
      sum += calculateRowSpan(item);
    });

  return sum;
};

export const formatDailyAgendaData = (
  planningExecution: PlanningExecution[],
) => {
  return planningExecution.map((post) => {
    const planningExecutionDetail = chain(
      post.dynamicShiftPlanningExecutionDetail,
    )
      .sortBy(["pumpAttendantId", "nozzleId", "startDateTime"])
      .groupBy(
        (shiftPlanningExecutionDetail) =>
          `${shiftPlanningExecutionDetail.pumpAttendantId}-${shiftPlanningExecutionDetail.startDateTime}`,
      )
      .value();

    const shiftPlanningExecutionDetail = Object.keys(
      planningExecutionDetail,
    ).map((key) => {
      const pumpExecution = chain(planningExecutionDetail[key])
        .groupBy((execution) => execution.pumpId)
        .value();

      const executionDetail = Object.keys(pumpExecution).map(
        (executionkey) => ({
          pumpId: executionkey,
          items: pumpExecution[executionkey],
        }),
      );

      return {
        pumpAttendantName: planningExecutionDetail[key][0].pumpAttendantName,
        startDateTime: planningExecutionDetail[key][0].startDateTime,
        items: executionDetail,
      };
    });

    return {
      id: post.id,
      name: post.shift.name,
      startingTime: post.startDateTime,
      endingTime: post.endDateTime,
      items: shiftPlanningExecutionDetail,
      status: post.status,
    };
  });
};
export const formatDailyAgendaDataAutomatic = (
  planningExecution: PlanningExecution[],
) => {
  return planningExecution.map((post) => {
    const planningExecutionDetail = chain(
      post.dynamicShiftPlanningExecutionDetail,
    )
      .groupBy("pumpAttendantName")
      .value();

    const shiftPlanningExecutionDetail = Object.keys(
      planningExecutionDetail,
    ).map((key) => {
      const totalAmount = planningExecutionDetail[key]
        .map((details) => details.totalAmount ?? 0)
        .reduce((acc, amount) => acc + amount, 0);

      return {
        id: planningExecutionDetail[key][0].id,
        pumpAttendantName: key,
        totalAmount: totalAmount,
        startDateTime: planningExecutionDetail[key][0].startDateTime,
        endDateTime: planningExecutionDetail[key][0].endDateTime,
      };
    });

    return {
      id: post.id,
      name: post.shift.name,
      startingTime: post.startDateTime,
      endingTime: post.endDateTime,
      items: shiftPlanningExecutionDetail,
      status: post.status,
    };
  });
};

export function formatValue(value?: number | "-") {
  return Number(value).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
