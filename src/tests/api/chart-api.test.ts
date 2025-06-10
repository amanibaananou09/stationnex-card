import api from "common/api/axios";
import {getChartByFuelCartPeriod, getdailyChart} from "common/api/chart-api";


jest.mock('common/api/axios');

describe('Transaction API functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getChartByFuelCartPeriod', () => {
        it('should build URL correctly with period and fetch data', async () => {
            const mockData = { chart: 'data' };
            (api.get as jest.Mock).mockResolvedValue({ data: mockData });

            const result = await getChartByFuelCartPeriod(
                'monthly',
                '2023-01-01',
                '2023-01-31',
                123,
            );

            expect(api.get).toHaveBeenCalledWith(
                '/transaction/chart?customerId=123&startDate=2023-01-01&endDate=2023-01-31&period=monthly'
            );
            expect(result).toEqual(mockData);
        });

        it('should build URL correctly without period', async () => {
            const mockData = { chart: 'data' };
            (api.get as jest.Mock).mockResolvedValue({ data: mockData });

            const result = await getChartByFuelCartPeriod(
                '',
                '2023-01-01',
                '2023-01-31',
                123,
            );

            expect(api.get).toHaveBeenCalledWith(
                '/transaction/chart?customerId=123&startDate=2023-01-01&endDate=2023-01-31'
            );
            expect(result).toEqual(mockData);
        });
    });

    describe('getdailyChart', () => {
        it('should build URL correctly with period and fetch data', async () => {
            const mockData = { daily: 'chart' };
            (api.get as jest.Mock).mockResolvedValue({ data: mockData });

            const result = await getdailyChart(
                'weekly',
                '2023-02-01',
                '2023-02-07',
                456,
            );

            expect(api.get).toHaveBeenCalledWith(
                '/transaction/dailyChart?customerId=456&startDate=2023-02-01&endDate=2023-02-07&period=weekly'
            );
            expect(result).toEqual(mockData);
        });

        it('should build URL correctly without period', async () => {
            const mockData = { daily: 'chart' };
            (api.get as jest.Mock).mockResolvedValue({ data: mockData });

            const result = await getdailyChart(
                '',
                '2023-02-01',
                '2023-02-07',
                456,
            );

            expect(api.get).toHaveBeenCalledWith(
                '/transaction/dailyChart?customerId=456&startDate=2023-02-01&endDate=2023-02-07'
            );
            expect(result).toEqual(mockData);
        });
    });
});