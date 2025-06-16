import React from "react";
import { render } from "@testing-library/react";
import {
  kanbanRenderThumbDark,
  kanbanRenderThumbLight,
  kanbanRenderTrack,
  kanbanRenderView,
  renderThumbDark,
  renderThumbLight,
  renderTrack,
  renderView,
} from "../../components/Scrollbar/Scrollbar";

describe("Scrollbar Components", () => {
  const mockProps = {
    style: {},
    className: "test-class",
    "data-testid": "test-element",
  };

  describe("Default Scrollbar Components", () => {
    it("should render track with correct styles", () => {
      const { getByTestId } = render(renderTrack(mockProps));
      const track = getByTestId("test-element");

      expect(track).toBeInTheDocument();
      expect(track).toHaveStyle({
        position: "absolute",
        width: "6px",
        opacity: "0",
        borderRadius: "3px",
        right: "0",
      });
    });

    it("should render dark thumb with correct styles", () => {
      const { getByTestId } = render(renderThumbDark(mockProps));
      const thumb = getByTestId("test-element");

      expect(thumb).toBeInTheDocument();
      expect(thumb).toHaveStyle({
        borderRadius: "15px",
        background: "rgba(222, 222, 222, 0.1)",
      });
    });

    it("should render light thumb with correct styles", () => {
      const { getByTestId } = render(renderThumbLight(mockProps));
      const thumb = getByTestId("test-element");

      expect(thumb).toBeInTheDocument();
      expect(thumb).toHaveStyle({
        borderRadius: "15px",
        background: "rgba(48, 48, 48, 0.1)",
      });
    });

    it("should render view with correct styles", () => {
      const { getByTestId } = render(renderView(mockProps));
      const view = getByTestId("test-element");

      expect(view).toBeInTheDocument();
      expect(view).toHaveStyle({
        marginRight: "-22px",
      });
    });
  });

  describe("Kanban Scrollbar Components", () => {
    it("should render kanban track with correct styles", () => {
      const { getByTestId } = render(kanbanRenderTrack(mockProps));
      const track = getByTestId("test-element");

      expect(track).toBeInTheDocument();
      expect(track).toHaveStyle({
        width: "6px",
        opacity: "0",
        borderRadius: "3px",
        right: "0",
      });
    });

    it("should render kanban dark thumb with correct styles", () => {
      const { getByTestId } = render(kanbanRenderThumbDark(mockProps));
      const thumb = getByTestId("test-element");

      expect(thumb).toBeInTheDocument();
      expect(thumb).toHaveStyle({
        borderRadius: "15px",
        background: "rgba(222, 222, 222, 0.1)",
      });
    });

    it("should render kanban light thumb with correct styles", () => {
      const { getByTestId } = render(kanbanRenderThumbLight(mockProps));
      const thumb = getByTestId("test-element");

      expect(thumb).toBeInTheDocument();
      expect(thumb).toHaveStyle({
        borderRadius: "15px",
        background: "rgba(48, 48, 48, 0.1)",
      });
    });

    it("should render kanban view with correct styles", () => {
      const { getByTestId } = render(kanbanRenderView(mockProps));
      const view = getByTestId("test-element");

      expect(view).toBeInTheDocument();
      expect(view).toHaveStyle({
        position: "relative",
        marginRight: "-15px",
      });
    });
  });

  it("should pass through all props to the div element", () => {
    const { getByTestId } = render(
      renderTrack({
        ...mockProps,
        id: "test-id",
        title: "test-title",
      }),
    );
    const track = getByTestId("test-element");

    expect(track).toHaveAttribute("id", "test-id");
    expect(track).toHaveAttribute("title", "test-title");
    expect(track).toHaveClass("test-class");
  });
});
