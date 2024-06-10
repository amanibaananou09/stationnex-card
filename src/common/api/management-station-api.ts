import {
  AddRotation,
  Period,
  PlanningExecution,
  PlanningExecutionDetail,
  PlanningUpdate,
  PumpAttendantCollectionSheet,
  Rotation,
} from "common/model";
import { Moment } from "moment";
import api from "./axios";

const API_URL = "/station";

export const allRotationByStation = async (
  stationId: number,
): Promise<Rotation[]> => {
  const response = await api.get(`${API_URL}/${stationId}/shiftRotation`);

  return response.data;
};

export const listPeriodByRotation = async (
  customerId: number,
): Promise<Period[]> => {
  const response = await api.get(
    `${API_URL}/${customerId}/shiftRotation/periods`,
  );

  return response.data;
};

export const addRotation = async (
  stationId: number | undefined,
  roulement: AddRotation,
): Promise<void> => {
  const response = await api.post(
    `${API_URL}/${stationId}/shiftRotation/add`,
    roulement,
  );
  return response.data;
};
export const updateRotation = async (
  stationId: number | undefined,
  roulement: AddRotation,
): Promise<void> => {
  const response = await api.put(
    `${API_URL}/${stationId}/shiftRotation/update`,
    roulement,
  );
  return response.data;
};
export const deleteRotation = async (
  stationId: number | undefined,
  rotationId: number | undefined,
): Promise<void> => {
  const response = await api.get(
    `${API_URL}/${stationId}/shiftRotation/${rotationId}/delete`,
  );
  return response.data;
};
export const rotationInformation = async (
  stationId: number,
  id: number,
): Promise<Rotation> => {
  const response = await api.get(`${API_URL}/${stationId}/shiftRotation/${id}`);

  return response.data;
};

export const getValidRotation = async (
  stationId: number,
  month: Moment | undefined,
): Promise<Rotation> => {
  const response = await api.get(
    `${API_URL}/${stationId}/shiftRotation/valid?month=${month?.format(
      "YYYY-MM-DD",
    )}`,
  );

  return response.data;
};

export const allPlanningExecution = async (
  stationId: number,
  day: Moment,
): Promise<PlanningExecution[]> => {
  const response = await api.post(
    `${API_URL}/${stationId}/shiftPlanningExecution/generate?day=${day.format(
      "YYYY-MM-DD",
    )}`,
  );
  return response.data;
};

export const startShiftPlanningExecution = async (
  stationId: number,
  shiftPlanningExecutionId: number,
  startDateTime: string,
) => {
  const response = await api.post(
    `${API_URL}/${stationId}/shiftPlanningExecution/start?shiftPlanningExecutionId=${shiftPlanningExecutionId}&startDateTime=${startDateTime}`,
  );
  return response.data;
};

export const stopShiftPlanningExecution = async (
  stationId: number,
  shiftPlanningExecutionId: number,
  stopDateTime: string,
) => {
  const response = await api.post(
    `${API_URL}/${stationId}/shiftPlanningExecution/stop?shiftPlanningExecutionId=${shiftPlanningExecutionId}&endDateTime=${stopDateTime}`,
  );
  return response.data;
};

export const updateShiftPlanningExecutionDetail = async (
  stationId: number,
  shiftPlanningExecutionDetail: PlanningExecutionDetail,
): Promise<void> => {
  const response = await api.post(
    `${API_URL}/${stationId}/shiftPlanningExecution/updateDetails`,
    shiftPlanningExecutionDetail,
  );
  return response.data;
};

export const updateCollectionSheet = async (
  stationId: number,
  pumpAttendantCollectionSheet: PumpAttendantCollectionSheet,
): Promise<void> => {
  const response = await api.post(
    `${API_URL}/${stationId}/shiftPlanningExecution/sheet/update`,
    pumpAttendantCollectionSheet,
  );
  return response.data;
};

export const getPlanningExecutionDetail = async (
  stationId: number,
  planningExecutionDetailId: number,
): Promise<PlanningExecutionDetail> => {
  const response = await api.get<PlanningExecutionDetail>(
    `${API_URL}/${stationId}/shiftPlanningExecutionDetail/${planningExecutionDetailId}`,
  );

  return response.data;
};

export const lockShiftPlanningExecution = async (
  id: number,
  shiftPlanningExecutionId: number,
) => {
  const response = await api.post(
    `${API_URL}/${id}/shiftPlanningExecution/lock?shiftPlanningExecutionId=${shiftPlanningExecutionId}`,
  );
  return response.data;
};

export const unlockShiftPlanningExecution = async (
  id: number,
  shiftPlanningExecutionId: number,
) => {
  const response = await api.post(
    `${API_URL}/${id}/shiftPlanningExecution/unlock?shiftPlanningExecutionId=${shiftPlanningExecutionId}`,
  );
  return response.data;
};

export const updateShiftPlanning = async (
  stationId: number,
  updateShiftPlanning: PlanningUpdate[],
): Promise<void> => {
  const response = await api.post(
    `${API_URL}/${stationId}/shiftPlanning/list/update`,
    updateShiftPlanning,
  );
  return response.data;
};
