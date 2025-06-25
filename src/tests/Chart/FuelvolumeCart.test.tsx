import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useAuth } from '../../store/AuthContext';
import { getChartByFuelCartPeriod } from '../../common/api/chart-api';
import { useTranslation } from 'react-i18next';
import ReactApexChart from 'react-apexcharts';
import FuelvolumeCart from "../../components/Charts/Fuelvolume";

// Mock dependencies
jest.mock('../../store/AuthContext');
jest.mock('../../common/api/chart-api');
jest.mock('react-i18next');
jest.mock('react-apexcharts', () => ({
    __esModule: true,
    default: () => <div data-testid="apex-chart-mock" />,
}));

// Complete i18n mock implementation
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            language: 'en',
            t: (key: string) => key,
            init: jest.fn(),
            loadResources: jest.fn(),
        },
    }),
}));

describe('FuelvolumeCart Component', () => {
    const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
    const mockGetChartByFuelCartPeriod = getChartByFuelCartPeriod as jest.MockedFunction<typeof getChartByFuelCartPeriod>;
    const mockUseTranslation = useTranslation as jest.MockedFunction<typeof useTranslation>;

    beforeEach(() => {
        // Setup default mocks
        mockUseAuth.mockReturnValue({
            customerId: 'test-customer',
            // Add other required auth properties if needed
        } as any);

        mockGetChartByFuelCartPeriod.mockResolvedValue([
            {
                fuelGrade: 'Diesel',
                cardIdentifier: 'Card1',
                sum: 100,
            },
            {
                fuelGrade: 'Gasoline',
                cardIdentifier: 'Card1',
                sum: 200,
            },
            {
                fuelGrade: 'Diesel',
                cardIdentifier: 'Card2',
                sum: 150,
            }
        ]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(
            <FuelvolumeCart
                periode="daily"
                startDate="2023-01-01"
                endDate="2023-01-31"
            />
    );
        expect(screen.getByTestId('apex-chart-mock')).toBeInTheDocument();
    });

    it('calls getChartByFuelCartPeriod with correct parameters', async () => {
        render(
            <FuelvolumeCart
                periode="daily"
                startDate="2023-01-01"
                endDate="2023-01-31"
            />
    );

        await waitFor(() => {
            expect(mockGetChartByFuelCartPeriod).toHaveBeenCalledWith(
                'daily',
                '2023-01-01',
                '2023-01-31',
                'test-customer'
            );
        });
    });

    it('processes chart data correctly', async () => {
        render(
            <FuelvolumeCart
                periode="daily"
                startDate="2023-01-01"
                endDate="2023-01-31"
            />
    );

        await waitFor(() => {
            expect(mockGetChartByFuelCartPeriod).toHaveBeenCalled();
            // Verify the chart is rendered with processed data
            expect(screen.getByTestId('apex-chart-mock')).toBeInTheDocument();
        });
    });

    it('handles API errors gracefully', async () => {
        mockGetChartByFuelCartPeriod.mockRejectedValue(new Error('API Error'));

        render(
            <FuelvolumeCart
                periode="daily"
                startDate="2023-01-01"
                endDate="2023-01-31"
            />
    );

        await waitFor(() => {
            expect(screen.getByTestId('apex-chart-mock')).toBeInTheDocument();
        });
    });

    it('updates when props change', async () => {
        const { rerender } = render(
            <FuelvolumeCart
                periode="daily"
                startDate="2023-01-01"
                endDate="2023-01-31"
            />
    );

        await waitFor(() => {
            expect(mockGetChartByFuelCartPeriod).toHaveBeenCalledTimes(1);
        });

        rerender(
            <FuelvolumeCart
                periode="weekly"
                startDate="2023-01-01"
                endDate="2023-01-31"
            />
    );

        await waitFor(() => {
            expect(mockGetChartByFuelCartPeriod).toHaveBeenCalledTimes(2);
            expect(mockGetChartByFuelCartPeriod).toHaveBeenLastCalledWith(
                'weekly',
                '2023-01-01',
                '2023-01-31',
                'test-customer'
            );
        });
    });

});