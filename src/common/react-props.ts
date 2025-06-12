import {ReactNode} from "react";
import {Station, User} from "./model";

export interface CustomCardProps {
  title: string;
  avatar?: string;
  description?: string;
  onClick: (title: string) => void;
}

export interface ConfiguratorProps {
  secondary: boolean;
  isOpen: boolean;
  onClose: () => void;
  isChecked: boolean;
  onSwitch: (isChecked: boolean) => void;
}

export interface FixedPluginProps {
  secondary: boolean;
  fixed: boolean;
  onOpen: React.MouseEventHandler<HTMLButtonElement> | undefined;
}
export interface AdminNavbarProps {
  logoText?: string;
  variant?: undefined;
  children?: undefined;
  fixed: boolean;
  secondary?: boolean;
  brandText?: string;
  onOpen: () => void;
  scrolled?: boolean;
}

export interface AuthNavbarProps {
  logo?: any;
  logoText?: string;
  secondary?: any;
}

export interface RenderTrackProps {
  style: React.CSSProperties;

  [key: string]: any;
}

export interface RenderThumbProps {
  style: React.CSSProperties;

  [key: string]: any;
}

export interface SidebarProps {
  logo: any;
  routes?: any;
  sidebarVariant?: string;
  hamburgerColor?: string;
  secondary?: any;
}

export interface AuthContextProps {
  token: string | null;
  isSignedIn: boolean;
  user: User | null;
  customerId: number;
  supplierId: number;
  signIn: (user: User, customerId: number, supplierId: number) => void;
  signOut: () => void;
}

export interface ESSContextProps {
  station: Station | null;
  stationId: number;
  customerAccountId: number;
  isLoading: boolean;
  selectStation: (selectedStation: Station) => void;
  clearContext: () => void;
}

export interface AuthContextProviderProps {
  children: ReactNode;
}
export interface PeriodeProps {
  periode: string;
  startDate: string;
  endDate: string;
}