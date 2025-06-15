import React from "react";
import { render, screen } from "@testing-library/react";
import {
  FuelGradeFormSkeleton,
  MonthlyPlanningSkeleton,
  PumpAttendantFormSkeleton,
  RotationFormSkeleton,
  ShiftPlanningExecutionDetailSkeleton,
  TableSkeleton,
  TeamFormSkeleton,
} from "../../components/Skeleton/Skeletons";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: any) => key,
  }),
}));
describe("Skeleton components", () => {

  it("renders ShiftPlanningExecutionDetailSkeleton with isAutomaticMode=false", () => {
    render(<ShiftPlanningExecutionDetailSkeleton isAutomaticMode={false} />);
    expect(screen.getByText("common.pump")).toBeInTheDocument();
    expect(screen.getByText("common.fuelGrades")).toBeInTheDocument();
    expect(screen.getByText("common.ComplementPost")).toBeInTheDocument();
    expect(screen.getByText("dailyAgenda.pumpAttendants")).toBeInTheDocument();
    expect(screen.getByText("common.startTime")).toBeInTheDocument();
    expect(screen.getByText("common.endTime")).toBeInTheDocument();
    expect(screen.getByText("common.TankReturn")).toBeInTheDocument();
  });

  it("renders ShiftPlanningExecutionDetailSkeleton with isAutomaticMode=true", () => {
    render(<ShiftPlanningExecutionDetailSkeleton isAutomaticMode={true} />);
    expect(screen.queryByText("common.pump")).not.toBeInTheDocument();
    expect(screen.queryByText("common.fuelGrades")).not.toBeInTheDocument();
    expect(screen.queryByText("common.TankReturn")).not.toBeInTheDocument();
  });

  it("renders MonthlyPlanningSkeleton", () => {
    const moment = { daysInMonth: () => 5 } as any;
    const { container } = render(
      <MonthlyPlanningSkeleton currentMonth={moment} />,
    );
    const skeletons = container.querySelectorAll(".chakra-skeleton");
    expect(skeletons.length).toBe(5);
  });

  it("renders TableSkeleton", () => {
    const { container } = render(<TableSkeleton />);
    const skeletons = container.querySelectorAll(".chakra-skeleton");
    expect(skeletons.length).toBe(9);
  });
});
