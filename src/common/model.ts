import { Moment } from "moment";
import { PeriodType } from "./enums";

export interface Station {
  id: number;
  name: string;
  address: string;
  actif: boolean;
  controllerPts: ControllerPts;
  country: Country;
  customerAccountId: number;
  customerAccountName: string;
  modeAffectation: string;
}

export interface Country {
  id: number;
  name: string;
  code: string;
  currency: Currency;
  currencyId?: number;
}

export interface Currency {
  code: string;
  id: number;
  locale: string;
  name: string;
}

export interface ControllerPts {
  id: number;
  ptsId: string;
  currentConfigurationId: number;
  currentFirmwareInformation: CurrentFirmwareInformation;
}

export interface CurrentFirmwareInformation {
  ptsId: string;
  dateTime: string;
  versionState: boolean;
  modificationDate: string;
}

export interface Transaction {
  id: string;
  pump: string;
  fuelGradeName: string;
  volume: number;
  volumeOperator: string;
  price: number;
  tag: string;
  amount: number;
  totalVolume: number;
  totalAmount: number;
  dateTimeStart: string;
  pumpAttendantName: string;
}

export interface Filter {
  pumpAttendantIds: number[];
  fuelGradeIds: number[];
  pumpIds: number[];
  period: { from: string; to: string };
  volume: { min: number; max: number };
}

export interface TransactionCreteria extends Filter {
  page: number;
  size: number;
}

export interface TankDelivery {
  tank: string;
  fuelGradeName: string;
  productHeight: number;
  waterHeight: number;
  temperature: number;
  productVolume: number;
}

export interface TankDeliveryCreteria {
  page: number;
  size: number;
  filterType: string;
  tank: string;
  startDate: string;
  endDate: string;
}

export interface Tank {
  idConf: string;
}

export interface ChartFilter {
  fuelGrade: string;
  pump: string;
  chartType: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    name: string;
    data: number[];
    borderWidth?: number;
  }[];
}

export interface RouteConfig {
  layout?: string;
  path?: string;
  name: string;
  hideInNavbar?: boolean;
  redirect?: boolean;
  category?: string;
  state?: string;
  views?: SubMenuConfig[];
  icon?: string | JSX.Element;
  image?: string | JSX.Element;
  secondaryNavbar?: boolean;
  collapse?: boolean;
  component?: () => JSX.Element;
  sideBarItemComponent?: React.ComponentType<{
    route: RouteConfig;
    isOpen: boolean;
  }>;
}

export interface SubMenuConfig extends RouteConfig {
  image?: JSX.Element;
}

export interface RouteParams {
  id: string;
}

export interface GeneralUser {
  id?: string;
  actif?: boolean;
  dateStatusChange?: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone: string;
  customerAccountId: string;
}

export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username: string;
  role?: string;
  token: string;
  expireTime?: number;
  phone: string;
  name: string;
  customerAccountId: string;
}

export interface DecodedToken {
  sid: string;
  name: string;
  preferred_username: string;
  realm_access: any;
  email: string;
  exp: number;
  given_name: string;
  family_name: string;
  phone: string;
  customerAccountId: string;
}

export interface FuelGrade {
  id: number;
  idConf: number;
  name: string;
  price: number;
  plannedDate: string;
}

export interface Grades {
  fuelGrade: string;
  totalSalesParAmount: number;
  totalSalesParVolume: number;
}

export interface Pump {
  id: string;
  portId: string;
  protocol: number;
  baudRate: number;
  address: string;
}

export interface TankMeasurement {
  tank: number;
  fuelGrade: string;
  percentage: number;
  productVolume: number;
  waterVolume: number;
  temperature: number;
}

export interface SalesPump {
  pumpId: number;
  allSales: number;
  pumpSales: number;
}

export interface SalesPumpGrades {
  pumpId: number;
  fuelGrade: String;
  totalSalesParAmount: number;
}

export interface LastTankDelivery {
  dateTime: string;
  tank: number;
  fullGrade: string;
  productHeight: number;
  waterHeight: number;
  temperature: number;
  productVolume: number;
  waterVolume: number;
  pumpsDispensedVolume: number;
  productTCVolume: number;
  productDensity: number;
  productMass: number;
}

export interface TankMeasurementData {
  dateTime: string;
  tank: number;
  fullGrade: string;
  productVolume: number;
}

export interface TankLevelData {
  dateTime: string;
  tank: number;
  fullGrade: string;
  productVolume: number;
  salesVolume: number;
  tankVolumeChanges: number;
  changedVolume: number;
}

export interface PumpAttendant {
  id?: number;
  matricule: string;
  stationId?: number;
  firstName: string;
  lastName: string;
  tag: string;
  actif?: boolean;
  address: string;
  phone: string;
  photo?: string;
  photoFile: File;
}

export interface PumpAttendantCreteria {
  page: number;
  size: number;
}

export interface PumpAttendantFormValues {
  id?: number;
  matricule: string;
  savedMatricule: string;
  stationId?: number;
  firstName: string;
  lastName: string;
  actif?: boolean;
  tag: string;
  savedTag: string;
  address: string;
  phone: string;
  photo?: string;
  photoFile: File;
}

export interface PumpTeam {
  id?: number;
  name: string;
  shiftRotationId: number;
  affectedPumpAttendant: AffectedPump[];
}

export interface AffectedPump {
  [key: string]: any;

  version?: string;
  id?: string;
  pumpId?: number;
  pumpAttendantTeamId?: number;
  pumpAttendantId?: number;
}

export interface PumpTeamFormValues {
  id?: number;
  name: string;
  shiftRotationId: number;
  affectedPumpAttendant: AffectedPump[];
}

export interface PumpAttendantTeam {
  id?: number;
  teamName: string;
  pumpAttendantToPump: Record<string, PumpAttendant>;
  shiftRotationId: number;
}

export interface Rotation {
  id?: number;
  stationId: number;
  name: string;
  startValidityDate: string;
  endValidityDate: string;
  shifts: Shift[];
  nbrOffDays?: number;
  planificationMode?: string;
}

export interface Period {
  periodType?: PeriodType;
  startDateTime?: string;
  endDateTime?: string;
}

export interface RotationFormValues {
  id?: number;
  stationId: number;
  name: string;
  nbrOffDays?: number;
  planificationMode?: string;
  startValidityDate: string;
  endValidityDate: string;
  shifts: Shift[];
}

export interface Shift {
  id: number;
  index?: number;
  name: string;
  shiftRotationId?: number;
  startValidityDate?: string;
  startingTime: string;
  endingTime: string;
  offDay?: boolean;
  crossesDayBoundary?: boolean;
}

export interface AddRotation {
  id?: number;
  name: string;
  startValidityDate: string;
  endValidityDate: string;
  stationId?: number;
  shifts: Shift[];
  nbrOffDays?: number;
  planificationMode?: string;
}

export interface Planning {
  id: number;
  shiftName: string;
  pumpAttendantTeam: PumpTeam;
  pumpAttendantTeamName: string;
  shiftRotationName: string;
  shiftRotationId: number;
  day: string;
  nbOffDay: string;
  hasExecution: boolean;
  offDay: boolean;
}

export interface PlanningUpdate {
  id: number;
  pumpAttendantTeamId: number | null;
  day: string;
}

export interface ShiftPlanning {
  stationId: number;
  month: Moment;
  numberOffDays?: string;
  planificationMode: string;
  shiftRotationId: number;
}

export interface ESSError {
  error: string;
  status: number;
  path: string;
  timestamp: string;
}

export interface PlanningExecution {
  id: number;
  pumpAttendant: any;
  shift: Shift;
  shiftId?: number;
  shiftPlanningId?: number;
  startDateTime: string;
  endDateTime: string;
  status?: string;
  dynamicShiftPlanningExecutionDetail: PlanningExecutionDetail[];
  pumpAttendantCollectionSheets?: PumpAttendantCollectionSheet[];
}

export interface PumpAttendantCollectionSheet {
  id: number;
  shiftPlanningExecutionId?: string;
  pumpAttendantId?: string;
  status?: string;
  totalAmount?: number;
  inconsistencyMotif?: string;
  collectionSheetDetails: CollectionSheetDetails[];
}

export interface CollectionSheetDetails {
  paymentMethodId?: number;
  amount?: number;
}

export interface PlanningExecutionDetail {
  id?: string;
  shiftPlanningExecutionId?: string;
  pumpAttendantId?: string;
  pumpAttendantName?: string;
  nozzleId?: string;
  startDateTime: string;
  endDateTime: string;
  pompiste?: string;
  pumpId?: string;
  nozzleName?: string;
  tankReturn?: string;
  startIndex?: number;
  endIndex?: number;
  totalVolume?: number;
  totalAmount?: number;
  prixUnitaire?: string;
  pumpIdConf?: string;
  nozzleIdConf?: string;
  reinforcementRequested?: boolean;
}

export interface PaymentMethod {
  code: string;
  customerAccountId: number;
  description: null;
  id: number;
}

export interface PlanningExecutionDetailFormValues {
  id?: string;
  shiftPlanningExecutionId?: string;
  pumpAttendantId?: string;
  nozzleId?: string;
  nozzleName?: string;
  startTime: string;
  startDate: string;
  endTime: string;
  endDate: string;
  pumpId?: string;
  tankReturn?: string;
  startIndex?: number;
  endIndex?: number;
  totalVolume?: number;
  totalAmount?: number;
  pumpIdConf?: string;
  nozzleIdConf?: string;
  reinforcementRequested?: boolean;
}

export interface FuelGradeFormValues {
  id: number;
  idConf: number;
  name: string;
  price: number;
  oldPrice: number;
  plannedDate: string;
}

export interface PlannedUpdatesFormValues {
  id: number;
  fuelGrade?: FuelGrade;
  newPrice: number;
  plannedDate: string;
}

export interface FuelGradePriceChange {
  id: number;
  stationId: number;
  scheduledDate: string;
  plannedDate: string;
  executionDate?: string;
  lastTrialDate?: string;
  requesterId: number;
  status: string;
  oldPrice: number;
  newPrice: number;
  requester: User;
  fuelGrade: FuelGrade;
}

export interface PriceModificationRequestCreteria {
  searchTerm?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export interface shiftPlanningFormValues {
  id: number;
  pumpAttendantTeamId: string;
}
