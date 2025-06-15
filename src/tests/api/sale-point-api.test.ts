import { SalePoint } from "common/model";
import {getSalePoint} from "common/api/sale-point-api";
import api from "common/api/axios";


// Mock the axios module
jest.mock("common/api/axios");

describe("getSalePoint API function", () => {
    const mockSalePoints: SalePoint[] = [
        {
            id: 1,
            name: "Sale Point 1",
            address: "123 Main St",
            city: "New York",
            country: {
                id: 1,
                name: "USA",
                code: "US",
                currency: {
                    id: 1,
                    code: "USD",
                    name: "US Dollar",
                    locale: "en-US"
                }
            }
        },
        {
            id: 2,
            name: "Sale Point 2",
            address: "456 Oak Ave",
            city: "Los Angeles",
            country: {
                id: 2,
                name: "USA",
                code: "US",
                currency: {
                    id: 1,
                    code: "USD",
                    name: "US Dollar",
                    locale: "en-US"
                }
            }
        }
    ];
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    it("should fetch sale points for a supplier successfully", async () => {
        // Mock successful API response
        (api.get as jest.Mock).mockResolvedValueOnce({
            data: mockSalePoints
        });

        const supplierId = 1;
        const result = await getSalePoint(supplierId);

        expect(api.get).toHaveBeenCalledWith(`/supplier/${supplierId}/salePoint`);
        expect(result).toEqual(mockSalePoints);
    });

    it("should handle undefined supplierId by making request with 'undefined' in URL", async () => {
        // Mock successful API response
        (api.get as jest.Mock).mockResolvedValueOnce({
            data: mockSalePoints
        });

        const result = await getSalePoint(undefined);

        expect(api.get).toHaveBeenCalledWith(`/supplier/undefined/salePoint`);
        expect(result).toEqual(mockSalePoints);
    });

    it("should throw an error when API request fails", async () => {
        // Mock failed API response
        const errorMessage = "Network Error";
        (api.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

        const supplierId = 1;

        await expect(getSalePoint(supplierId)).rejects.toThrow(errorMessage);
        expect(api.get).toHaveBeenCalledWith(`/supplier/${supplierId}/salePoint`);
    });

    it("should return empty array when API returns no data", async () => {
        // Mock empty response
        (api.get as jest.Mock).mockResolvedValueOnce({
            data: []
        });

        const supplierId = 1;
        const result = await getSalePoint(supplierId);

        expect(api.get).toHaveBeenCalledWith(`/supplier/${supplierId}/salePoint`);
        expect(result).toEqual([]);
    });

    it("should handle null supplierId by making request with 'null' in URL", async () => {
        // Mock successful API response
        (api.get as jest.Mock).mockResolvedValueOnce({
            data: mockSalePoints
        });

        // Cast null to number | undefined to match the function signature
        const result = await getSalePoint(null as unknown as number | undefined);

        expect(api.get).toHaveBeenCalledWith(`/supplier/null/salePoint`);
        expect(result).toEqual(mockSalePoints);
    });
});