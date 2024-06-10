import { Mode } from "common/enums";
import moment, { Moment } from "moment";
import {
  FuelGrade,
  FuelGradeFormValues,
  FuelGradePriceChange,
  PlannedUpdatesFormValues,
  PlanningExecutionDetail,
  PlanningExecutionDetailFormValues,
  PumpAttendant,
  PumpAttendantFormValues,
  PumpTeam,
  PumpTeamFormValues,
  Rotation,
  RotationFormValues,
} from "../common/model";

/**
 * Pump Attendant form
 */

export const pumpAttendantInitFormValues = {
  matricule: "",
  savedMatricule: "",
  firstName: "",
  lastName: "",
  tag: "",
  savedTag: "",
  address: "",
  phone: "",
  actif: false,
  photo: "",
};

export const pumpAttendantToFormValues = (
  pumpAttendant: PumpAttendant,
): PumpAttendantFormValues => {
  const {
    id,
    matricule,
    firstName,
    lastName,
    tag,
    address,
    phone,
    actif,
    photo,
    photoFile,
  } = pumpAttendant;

  return {
    id,
    matricule,
    savedMatricule: matricule,
    firstName,
    lastName,
    tag,
    savedTag: tag,
    address,
    phone,
    actif,
    photo,
    photoFile,
  };
};

export const formValuesToPumpAttendant = (
  values: PumpAttendantFormValues,
): PumpAttendant => {
  const {
    id,
    matricule,
    firstName,
    lastName,
    tag,
    address,
    phone,
    actif,
    photo,
    photoFile,
  } = values;

  return {
    id,
    matricule,
    firstName,
    lastName,
    tag,
    address,
    phone,
    actif,
    photo,
    photoFile,
  };
};

/**
 * Rotation Form
 */

export const rotationInitFormValues = {
  mode: Mode.CREATE,
  name: "",
  nbrOffDays: 0,
  startValidityDate: moment().format("YYYY-MM-DD"),
  endValidityDate: moment().endOf("month").format("YYYY-MM-DD"),
  shifts: [
    {
      name: "",
      startingTime: "",
      endingTime: "",
      crossesDayBoundary: false,
    },
  ],
};

export const rotationToFormValues = (
  rotation: Rotation,
): RotationFormValues => {
  const {
    id,
    stationId,
    name,
    nbrOffDays,
    startValidityDate,
    endValidityDate,
    shifts,
  } = rotation;

  return {
    id,
    stationId,
    name,
    nbrOffDays,
    startValidityDate,
    endValidityDate,
    shifts,
  };
};

export const formValuesToRotation = (values: RotationFormValues): Rotation => {
  const {
    id,
    stationId,
    name,
    nbrOffDays,
    startValidityDate,
    endValidityDate,
    shifts,
  } = values;

  return {
    id,
    stationId,
    name,
    nbrOffDays,
    startValidityDate,
    endValidityDate,
    shifts,
  };
};

/**
 * Planning Execution detail form
 */

export const planningExecutionInitFormValues = {
  id: "",
  nozzleName: "",
  shiftPlanningExecutionId: "",
  pumpAttendantId: "",
  pumpId: "",
  pumpIdConf: "",
  nozzleId: "",
  nozzleIdConf: "",
  startTime: "",
  startDate: "",
  endTime: "",
  endDate: "",
  tankReturn: "",
  startIndex: 0,
  endIndex: 0,
  totalVolume: 0,
  totalAmount: 0,
  reinforcementRequested: false,
};

export const planningExecutionDetailToFormValues = (
  planningExecutionDetail: PlanningExecutionDetail,
  currentDay: Moment,
): PlanningExecutionDetailFormValues => {
  return {
    id: planningExecutionDetail?.id,
    nozzleName: planningExecutionDetail?.nozzleName,
    shiftPlanningExecutionId: planningExecutionDetail?.shiftPlanningExecutionId,
    pumpAttendantId: planningExecutionDetail?.pumpAttendantId,
    pumpId: planningExecutionDetail?.pumpId,
    pumpIdConf: planningExecutionDetail?.pumpIdConf,
    nozzleId: planningExecutionDetail?.nozzleId,
    nozzleIdConf: planningExecutionDetail?.nozzleIdConf,
    startTime: planningExecutionDetail?.startDateTime
      ? moment(planningExecutionDetail?.startDateTime).format("HH:mm")
      : "",
    startDate: currentDay.format("YYYY-MM-DD"),
    endTime: planningExecutionDetail?.endDateTime
      ? moment(planningExecutionDetail?.endDateTime).format("HH:mm")
      : "",
    endDate: currentDay.format("YYYY-MM-DD"),
    tankReturn: planningExecutionDetail?.tankReturn,
    startIndex: planningExecutionDetail?.startIndex,
    endIndex: planningExecutionDetail?.endIndex,
    totalVolume: planningExecutionDetail?.totalVolume,
    totalAmount: planningExecutionDetail?.totalAmount,
    reinforcementRequested: planningExecutionDetail?.reinforcementRequested,
  };
};

export const formValuesToPlanningExecutionDetail = (
  planningExecutionDetailFormValues: PlanningExecutionDetailFormValues,
): PlanningExecutionDetail => {
  return {
    id: planningExecutionDetailFormValues?.id,
    shiftPlanningExecutionId:
      planningExecutionDetailFormValues?.shiftPlanningExecutionId,
    pumpAttendantId: planningExecutionDetailFormValues?.pumpAttendantId,
    pumpId: planningExecutionDetailFormValues?.pumpId,
    pumpIdConf: planningExecutionDetailFormValues?.pumpIdConf,
    nozzleId: planningExecutionDetailFormValues?.nozzleId,
    nozzleIdConf: planningExecutionDetailFormValues?.nozzleIdConf,
    startDateTime:
      planningExecutionDetailFormValues?.startDate +
      "T" +
      planningExecutionDetailFormValues?.startTime,
    endDateTime:
      planningExecutionDetailFormValues?.endDate +
      "T" +
      planningExecutionDetailFormValues?.endTime,
    tankReturn: planningExecutionDetailFormValues?.tankReturn,
    startIndex: planningExecutionDetailFormValues?.startIndex,
    endIndex: planningExecutionDetailFormValues?.endIndex,
    totalVolume: planningExecutionDetailFormValues?.totalVolume,
    totalAmount: planningExecutionDetailFormValues?.totalAmount,
    reinforcementRequested:
      planningExecutionDetailFormValues?.reinforcementRequested,
  };
};

export const pumpTeamInitFormValues = {
  name: "",
  affectedPumpAttendant: [],
};

export const pumpTeamToFormValues = (
  pumpTeam: PumpTeam,
): PumpTeamFormValues => {
  const { id, name, shiftRotationId, affectedPumpAttendant } = pumpTeam;

  return {
    id,
    name: name,
    shiftRotationId,
    affectedPumpAttendant,
  };
};

export const formValuesToPumpTeam = (
  values: Partial<PumpTeamFormValues>,
): PumpTeam => {
  const {
    id,
    name = "",
    shiftRotationId = 0,
    affectedPumpAttendant = [],
  } = values;

  return {
    id,
    name,
    shiftRotationId,
    affectedPumpAttendant: affectedPumpAttendant.filter(
      (affectation) => !!affectation.pumpAttendantId,
    ),
  };
};

// Fuel Grades Initialization Values
export const fuelGradeInitFormValues: FuelGradeFormValues = {
  id: 0,
  idConf: 0,
  name: "",
  price: 0,
  oldPrice: 0,
  plannedDate: "",
};

// Convert Fuel Grade to Form Values
export const fuelGradeToFormValues = (
  fuelGrade: FuelGrade,
): FuelGradeFormValues => {
  const { id, idConf, name, price } = fuelGrade;

  return {
    id,
    idConf,
    name,
    price,
    oldPrice: price,
    plannedDate: moment().format("YYYY-MM-DDTHH:mm"),
  };
};

// Convert Form Values to Fuel Grade
export const formValuesToFuelGrade = (
  values: FuelGradeFormValues,
): FuelGrade => {
  const { id, idConf, name, price, plannedDate } = values;

  return {
    id,
    idConf,
    name,
    price,
    plannedDate,
  };
};

export const formValuesToPlannedUpdates = (
  values: PlannedUpdatesFormValues,
): PlannedUpdatesFormValues => {
  const { id, newPrice, plannedDate } = values;

  return {
    id,
    newPrice,
    plannedDate,
  };
};
export const plannedFuelGradePriceChangeInitFormValues = {
  id: 0,
  newPrice: 0,
  plannedDate: "",
};
export const plannedUpdatesToFormValues = (
  fuelGradePrice: FuelGradePriceChange,
): PlannedUpdatesFormValues => {
  const { id, newPrice, fuelGrade, plannedDate } = fuelGradePrice;

  return {
    id,
    fuelGrade,
    newPrice,
    plannedDate,
  };
};
