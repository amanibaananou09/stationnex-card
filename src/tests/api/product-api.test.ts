import { Product } from "common/model";
import api from "common/api/axios";
import {getProduct} from "common/api/product-api";


// Mock the axios module
jest.mock("common/api/axios");

describe("getProduct API function", () => {
    const mockProducts: Product[] = [
        {
            id: 1,
            name: "Product 1",
            price: 10.99,
        },
        {
            id: 2,
            name: "Product 2",
            price: 20.99,
        }
    ];

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    it("should fetch products for a supplier successfully", async () => {
        // Mock successful API response
        (api.get as jest.Mock).mockResolvedValueOnce({
            data: mockProducts
        });

        const supplierId = 1;
        const result = await getProduct(supplierId);

        expect(api.get).toHaveBeenCalledWith(`/product/supplier/${supplierId}`);
        expect(result).toEqual(mockProducts);
    });

    it("should handle null supplierId by making request with null in URL", async () => {
        // Mock successful API response
        (api.get as jest.Mock).mockResolvedValueOnce({
            data: mockProducts
        });

        const result = await getProduct(null);

        expect(api.get).toHaveBeenCalledWith(`/product/supplier/null`);
        expect(result).toEqual(mockProducts);
    });

    it("should throw an error when API request fails", async () => {
        // Mock failed API response
        const errorMessage = "Network Error";
        (api.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

        const supplierId = 1;

        await expect(getProduct(supplierId)).rejects.toThrow(errorMessage);
        expect(api.get).toHaveBeenCalledWith(`/product/supplier/${supplierId}`);
    });

    it("should return empty array when API returns no data", async () => {
        // Mock empty response
        (api.get as jest.Mock).mockResolvedValueOnce({
            data: []
        });

        const supplierId = 1;
        const result = await getProduct(supplierId);

        expect(api.get).toHaveBeenCalledWith(`/product/supplier/${supplierId}`);
        expect(result).toEqual([]);
    });
});