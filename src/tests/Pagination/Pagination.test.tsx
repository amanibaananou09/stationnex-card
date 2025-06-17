import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import Pagination from "../../components/Pagination/Pagination";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "common.page": "Page",
        "common.of": "of",
        "common.report": "elements",
      };
      return translations[key] || key;
    },
  }),
}));

describe("Pagination Component", () => {
  const mockOnChange = jest.fn();
  const totalPages = 5;
  const totalElements = totalPages * 25;

  const renderComponent = (currentPage: number) => {
    return render(
        <ChakraProvider>
          <Pagination
              onChange={mockOnChange}
              totalPages={totalPages}
              totalElements={totalElements}
          />
        </ChakraProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should display correct page information", () => {
      renderComponent(0);
      expect(screen.getByText("Page 1 of 5")).toBeInTheDocument();
      expect(screen.getByText("125 elements")).toBeInTheDocument();
    });

    it("should render all navigation buttons with correct labels", () => {
      renderComponent(0);
      expect(screen.getByText("<<")).toBeInTheDocument();
      expect(screen.getByText("<")).toBeInTheDocument();
      expect(screen.getByText("Page 1 of 5")).toBeInTheDocument();
      expect(screen.getByText(">")).toBeInTheDocument();
      expect(screen.getByText(">>")).toBeInTheDocument();
      expect(screen.getByText("125 elements")).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {

    it("should go to previous page when clicking <", () => {
      renderComponent(1);
      const previousButton = screen.getByText("<");
      fireEvent.click(previousButton);
      expect(mockOnChange).toHaveBeenCalledWith(0, 25);
    });

    it("should go to first page when clicking <<", () => {
      renderComponent(2);
      const firstPageButton = screen.getByText("<<");
      fireEvent.click(firstPageButton);
      expect(mockOnChange).toHaveBeenCalledWith(0, 25);
    });

    it("should go to last page when clicking >>", () => {
      renderComponent(2);
      const lastPageButton = screen.getByText(">>");
      fireEvent.click(lastPageButton);
      expect(mockOnChange).toHaveBeenCalledWith(4, 25);
    });
  });

  describe("Button States", () => {
    it("should disable previous buttons on first page", () => {
      renderComponent(0);
      expect(screen.getByText("<<")).toBeDisabled();
      expect(screen.getByText("<")).toBeDisabled();
      expect(screen.getByText(">")).toBeEnabled();
      expect(screen.getByText(">>")).toBeEnabled();
    });

    it("should disable all buttons when there are no pages", () => {
      render(
          <ChakraProvider>
            <Pagination
                onChange={mockOnChange}
                totalPages={0}
                totalElements={0}
            />
          </ChakraProvider>
      );
      expect(screen.getByText("<<")).toBeDisabled();
      expect(screen.getByText("<")).toBeDisabled();
      expect(screen.getByText(">")).toBeDisabled();
      expect(screen.getByText(">>")).toBeDisabled();
    });
  });
});