import { addFilterParams } from "common/api/api-utils";

describe('addFilterParams', () => {
    it('should append startDate and endDate when both are provided', () => {
        const url = 'https://example.com/api?existingParam=value&';
        const startDate = '2024-01-01';
        const endDate = '2024-01-31';

        const result = addFilterParams(url, startDate, endDate);

        expect(result).toBe(
            'https://example.com/api?existingParam=value&startDate=2024-01-01&endDate=2024-01-31'
        );
    });

    it('should append only startDate when endDate is undefined', () => {
        const url = 'https://example.com/api?existingParam=value&';
        const startDate = '2024-01-01';

        const result = addFilterParams(url, startDate);

        expect(result).toBe(
            'https://example.com/api?existingParam=value&startDate=2024-01-01'
        );
    });

    it('should append only endDate when startDate is undefined', () => {
        const url = 'https://example.com/api?existingParam=value';
        const endDate = '2024-01-31';

        const result = addFilterParams(url, undefined, endDate);

        expect(result).toBe(
            'https://example.com/api?existingParam=value&endDate=2024-01-31'
        );
    });

    it('should return original url if no startDate or endDate provided', () => {
        const url = 'https://example.com/api?existingParam=value&';

        const result = addFilterParams(url);

        expect(result).toBe(url);
    });

    it('should handle URL without existing query parameters', () => {
        const url = 'https://example.com/api?';
        const startDate = '2024-01-01';

        const result = addFilterParams(url, startDate);

        expect(result).toBe('https://example.com/api?startDate=2024-01-01');
    });
});