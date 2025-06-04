import { renderHook } from '@testing-library/react-hooks';
import { useQuery } from '@tanstack/react-query';
import {usePeriods} from "../../hooks/use-periods";

// Mock @tanstack/react-query
jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
}));

describe('usePeriods', () => {
    const mockPeriodsData = [
        { id: 1, name: 'Period 1' },
        { id: 2, name: 'Period 2' },
    ];

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
    });

    it('should fetch periods and loading state correctly', () => {
        // Mock useQuery to return desired data
        (useQuery as jest.Mock).mockReturnValue({
            data: mockPeriodsData,
            isLoading: false,
        });

        const { result } = renderHook(() => usePeriods());

        expect(useQuery).toHaveBeenCalledWith({
            queryKey: ['periods'],
            queryFn: expect.any(Function),
            staleTime: Infinity,
        });

        expect(result.current.periods).toEqual(mockPeriodsData);
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle loading state', () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: null,
            isLoading: true,
        });

        const { result } = renderHook(() => usePeriods());

        expect(result.current.periods).toBeNull();
        expect(result.current.isLoading).toBe(true);
    });
});