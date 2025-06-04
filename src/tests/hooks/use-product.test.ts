import { renderHook } from '@testing-library/react-hooks';
import { useQuery } from '@tanstack/react-query';
import {useProduct} from "../../hooks/use-product";

// Mock @tanstack/react-query
jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
}));

// Mock the getProduct API
jest.mock('../../common/api/product-api', () => ({
    getProduct: jest.fn(),
}));

describe('useProduct', () => {
    const mockProductData = { id: 1, name: 'Sample Product' };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('fetches product data and returns loading state', () => {
        // Mock useQuery to simulate loading
        (useQuery as jest.Mock).mockReturnValue({
            data: null,
            isLoading: true,
        });

        const { result } = renderHook(() => useProduct(123));

        expect(useQuery).toHaveBeenCalledWith({
            queryKey: ['product'],
            queryFn: expect.any(Function),
        });

        expect(result.current.product).toBeNull();
        expect(result.current.isLoading).toBe(true);
    });

    it('returns product data when available', () => {
        // Mock useQuery to return data
        (useQuery as jest.Mock).mockReturnValue({
            data: mockProductData,
            isLoading: false,
        });

        const { result } = renderHook(() => useProduct(123));

        expect(result.current.product).toEqual(mockProductData);
        expect(result.current.isLoading).toBe(false);
    });
});