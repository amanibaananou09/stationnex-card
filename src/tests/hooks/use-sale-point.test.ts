// useSalePoint.test.ts
import { useQuery } from '@tanstack/react-query';
import {useSalePoint} from "../../hooks/use-sale-point";

// Mock useQuery to avoid needing QueryClientProvider
jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
}));

describe('useSalePoint', () => {
    const mockSalePointData = [{ id: 1, name: 'Point A' }];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns sale point data successfully', () => {
        // Mock useQuery to simulate a successful fetch
        (useQuery as jest.Mock).mockImplementation(() => ({
            data: mockSalePointData,
            isLoading: false,
        }));

        const result = useSalePoint(123);
        expect(result.salepoint).toEqual(mockSalePointData);
        expect(result.isLoading).toBe(false);
    });

    it('returns empty array when supplierId is 0', () => {
        // Simulate the enabled condition disables fetch
        (useQuery as jest.Mock).mockImplementation(() => ({
            data: null,
            isLoading: false,
        }));

        const result = useSalePoint(0);
        expect(result.salepoint).toEqual([]);
    });

    it('handles loading state', () => {
        (useQuery as jest.Mock).mockImplementation(() => ({
            data: null,
            isLoading: true,
        }));

        const result = useSalePoint(456);
        expect(result.salepoint).toEqual([]);
        expect(result.isLoading).toBe(true);
    });
});