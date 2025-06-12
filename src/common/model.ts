import {PeriodType} from "./enums";

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

export interface TransactionCreteria extends Filter {
  page: number;
  size: number;
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

export interface Grades {
  fuelGrade: string;
  totalSalesParAmount: number;
  totalSalesParVolume: number;
}

export interface Period {
  periodType?: PeriodType;
  startDateTime?: string;
  endDateTime?: string;
}

export interface Transaction {
  remainingBalancePerProduct: { [productName: string]: number };
  id: string;
  cardId: string;
  dateTime: string;
  city: string;
  productName: string;
  price: number;
  productId: number;
  quantity: number;
  amount: number;
  salePoint: SalePoint;
  salePointName: string;
  address: string;
  availableBalance: number;
  availableVolume: number;
  cardIdentifier: string;
}

export interface Filter {
  cardIds: number[];
  salePointIds: number[];
  productIds: number[];
  period: { from: string; to: string };
  city: string[];
}

export interface GeneralCard {
  index?: number;
  id?: string;
  companyName: string;
  holder: string;
  cardId: string;
  codePin: string;
  holderPassword: string;
  expirationDate: string;
  actif: boolean;
  customerId?: string;
  accountId?: string;
  cardGroupId?: string;
  cardGroupName: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface SalePoint {
  id?: number;
  name?: string;
  countryName?: string;
  country: Country;
  city?: string;
  area?: string;
  actif?: boolean;
  address?: string;
  phone?: string;
  email?: string;
  username?: string;
}
