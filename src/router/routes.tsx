import SignIn from "views/Pages/SignIn";
import { RouteConfig } from "common/model";
import { DocumentIcon, PersonIcon, WalletIcon } from "components/Icons/Icons";
import { useTranslation } from "react-i18next";
import ForgotPassword from "views/Pages/ForgotPassword";
import ResetPassword from "views/Pages/ResetPassword";
import React from "react";
import { FaChartColumn, FaMoneyBills } from "react-icons/fa6";
import { TbReport } from "react-icons/tb";
import { FaMoneyBillWave } from "react-icons/fa";
import { PiHandCoinsFill } from "react-icons/pi";
import Dashboard from "../views/Dashboard/Dashboard";
import Transactions from "views/Dashboard/Transactions";

export const dashboardRoutes = (): RouteConfig[] => {
  const { t } = useTranslation();
  return [
    {
      path: "/home",
      name: t("routes.dashboard"),
      icon: <FaChartColumn color="inherit" />,
      component: Dashboard,
      layout: "/stationnex-card",
    },
    {
      path: "/cardManagement",
      name: t("routes.cardManagement"),
      icon: <WalletIcon color="inherit" />,
      //component: Transactions,
      layout: "/stationnex-card",
    },
    {
      path: "/transactions",
      name: t("routes.transactions"),
      icon: <TbReport color="inherit" />,
      component: Transactions,
      layout: "/stationnex-card",
    },
    {
      path: "/profile",
      name: t("routes.profile"),
      icon: <PersonIcon color="inherit" />,
      //component: Profile,
      layout: "/stationnex-card",
    },
    {
      path: "/payment",
      name: t("routes.payment"),
      icon: <FaMoneyBills color="inherit" />,
      //component: Payment,
      layout: "/stationnex-card",
    },
    {
      path: "/facturation",
      name: t("routes.facturation"),
      icon: <FaMoneyBillWave color="inherit" />,
      //component: Profile,
      layout: "/stationnex-card",
    },
    {
      path: "/support",
      name: t("routes.support"),
      icon: <PiHandCoinsFill color="inherit" />,
      //component: Profile,
      layout: "/stationnex-card",
    },
  ];
};

export const authRoutes = (): RouteConfig[] => {
  const { t } = useTranslation();
  return [
    {
      path: "/signin",
      name: t("routes.signIn"),
      icon: <DocumentIcon color="inherit" />,
      component: SignIn,
      layout: "/auth",
    },
    {
      path: "/Forgot-Password",
      name: t("routes.signIn"),
      icon: <DocumentIcon color="inherit" />,
      component: ForgotPassword,
      layout: "/auth",
      hideInNavbar: true,
    },
    {
      path: "/reset-password",
      name: t("routes.signIn"),
      icon: <DocumentIcon color="inherit" />,
      component: ResetPassword,
      layout: "/auth",
      hideInNavbar: true,
    },
  ];
};
