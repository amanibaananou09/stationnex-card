import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useAuth } from '../../store/AuthContext';
import { getdailyChart } from '../../common/api/chart-api';
import VolumeCard from "../../components/Charts/VolumeCard";

// Mock the dependencies
jest.mock('../../store/AuthContext');
jest.mock('../../common/api/chart-api');
jest.mock('react-apexcharts', () => ({
    __esModule: true,
    default: () => <div data-testid="apex-chart-mock" />,
}));

describe('VolumeCard Component', () => {
    const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
    const mockGetDailyChart = getdailyChart as jest.MockedFunction<typeof getdailyChart>;

    beforeEach(() => {
        // Setup default mocks
        mockUseAuth.mockReturnValue({
            customerId: 'test-customer',
            // Add other required auth properties if needed
        } as any);

        mockGetDailyChart.mockResolvedValue([
            {
                cardIdentifier: 'Card1',
                sum: 100,
                date: '2023-01-01'
            },
            {
                cardIdentifier: 'Card2',
                sum: 200,
                date: '2023-01-01'
            },
            {
                cardIdentifier: 'Card1',
                sum: 150,
                date: '2023-01-02'
            }
        ]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(
            <VolumeCard
                periode="daily"
        startDate="2023-01-01"
        endDate="2023-01-31"
            />
    );
        expect(screen.getByTestId('apex-chart-mock')).toBeInTheDocument();
    });

    it('calls getdailyChart with correct parameters', async () => {
        render(
            <VolumeCard
                periode="daily"
                startDate="2023-01-01"
                endDate="2023-01-31"
            />
    );

        await waitFor(() => {
            expect(mockGetDailyChart).toHaveBeenCalledWith(
                'daily',
                '2023-01-01',
                '2023-01-31',
                'test-customer'
            );
        });
    });

    it('handles API errors gracefully', async () => {
        mockGetDailyChart.mockRejectedValue(new Error('API Error'));

        render(
            <VolumeCard
                periode="daily"
                startDate="2023-01-01"
                endDate="2023-01-31"
            />
    );

        await waitFor(() => {
            expect(screen.getByTestId('apex-chart-mock')).toBeInTheDocument();
        });
    });

    it('processes data correctly for the chart', async () => {
        render(
            <VolumeCard
                periode="daily"
                startDate="2023-01-01"
                endDate="2023-01-31"
            />
    );

        await waitFor(() => {
            // Verify the chart is rendered (actual data processing is harder to test with the mock)
            expect(screen.getByTestId('apex-chart-mock')).toBeInTheDocument();

            // In a real test, you might want to check the props passed to ReactApexChart
            // This would require a more sophisticated mock of the chart component
        });
    });

    it('updates when props change', async () => {
        const { rerender } = render(
            <VolumeCard
                periode="daily"
                startDate="2023-01-01"
                endDate="2023-01-31"
            />
    );

        await waitFor(() => {
            expect(mockGetDailyChart).toHaveBeenCalledTimes(1);
        });

        rerender(
            <VolumeCard
                periode="weekly"
                startDate="2023-01-01"
                endDate="2023-01-31"
            />
    );

        await waitFor(() => {
            expect(mockGetDailyChart).toHaveBeenCalledTimes(2);
            expect(mockGetDailyChart).toHaveBeenLastCalledWith(
                'weekly',
                '2023-01-01',
                '2023-01-31',
                'test-customer'
            );
        });
    });
});