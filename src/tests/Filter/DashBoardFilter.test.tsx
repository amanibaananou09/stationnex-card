import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import moment from "moment";
import {ChakraProvider} from "@chakra-ui/react";
import DashBoardFilter, {getDefaultDates} from "../../components/Filter/DashBoardFilter";

// Mock the translation hook
jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                "common.today": "Today",
                "common.yesterday": "Yesterday",
                "common.weekly": "Weekly",
                "common.monthly": "Monthly",
                "common.from": "From",
                "common.to": "To",
                "common.search": "Search",
            };
            return translations[key] || key;
        },
    }),
}));

// Mock the truncateText utility
jest.mock("utils/utils", () => ({
    truncateText: (text: string, length: number) => text.substring(0, length),
}));

// Mock useBreakpointValue to return consistent values for testing
jest.mock("@chakra-ui/react", () => {
    const originalModule = jest.requireActual("@chakra-ui/react");
    return {
        ...originalModule,
        useBreakpointValue: jest.fn().mockImplementation((params) => {
            if (typeof params === "object" && !Array.isArray(params)) {
                return params.base;
            }
            return params;
        }),
    };
});
describe("DashBoardFilter", () => {
    const mockFilterChange = jest.fn();
    const mockOnSearch = jest.fn();

    const defaultProps = {
        selectedFilter: "today",
        onFilterChange: mockFilterChange,
        onSearch: mockOnSearch,
    };

    const renderComponent = (props = {}) => {
        return render(
            <ChakraProvider>
                <DashBoardFilter {...defaultProps} {...props} />
            </ChakraProvider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders all filter buttons and date inputs", () => {
        renderComponent();

        expect(screen.getByText("Today")).toBeInTheDocument();
        expect(screen.getByText("Yesterday")).toBeInTheDocument();
        expect(screen.getByText("Weekly")).toBeInTheDocument();
        expect(screen.getByText("Monthly")).toBeInTheDocument();
        expect(screen.getByText("Search")).toBeInTheDocument();
    });

    it("calls onSearch with correct dates when search button is clicked", () => {
        renderComponent();

        const today = moment();
        const fromDate = today.startOf("day").format("YYYY-MM-DDTHH:mm");
        const toDate = today.endOf("day").format("YYYY-MM-DDTHH:mm");

        fireEvent.click(screen.getByText("Search"));

        expect(mockOnSearch).toHaveBeenCalledWith(fromDate, toDate);
    });

    it("updates dates correctly when 'Yesterday' filter is clicked", () => {
        renderComponent();

        fireEvent.click(screen.getByText("Yesterday"));

        expect(mockFilterChange).toHaveBeenCalledWith("yesterday");
        const { fromDate, toDate } = getDefaultDates("yesterday");
        expect(screen.getByDisplayValue(fromDate)).toHaveValue(fromDate);
        expect(screen.getByDisplayValue(toDate)).toHaveValue(toDate);
    });

    it("updates dates correctly when 'Weekly' filter is clicked", () => {
        renderComponent();

        fireEvent.click(screen.getByText("Weekly"));

        expect(mockFilterChange).toHaveBeenCalledWith("weekly");
        const { fromDate, toDate } = getDefaultDates("weekly");
        expect(screen.getByDisplayValue(fromDate)).toHaveValue(fromDate);
        expect(screen.getByDisplayValue(toDate)).toHaveValue(toDate);
    });

    it("updates dates correctly when 'Monthly' filter is clicked", () => {
        renderComponent();

        fireEvent.click(screen.getByText("Monthly"));

        expect(mockFilterChange).toHaveBeenCalledWith("monthly");
        const { fromDate, toDate } = getDefaultDates("monthly");
        expect(screen.getByDisplayValue(fromDate)).toHaveValue(fromDate);
        expect(screen.getByDisplayValue(toDate)).toHaveValue(toDate);
    });
});