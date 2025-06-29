import jwt_decode from 'jwt-decode';
import {
    decodeToken,
    formatDate,
    formatNumber,
    formatNumbeer,
    truncateText,
    calculateRowSpan,
    formatNumberByCountryCode
} from 'utils/utils';

// Mock jwt_decode
jest.mock('jwt-decode');

describe('Utility Functions', () => {
    describe('decodeToken', () => {
        it('should return null for null token', () => {
            expect(decodeToken(null)).toBeNull();
        });

        it('should return null for empty token', () => {
            expect(decodeToken('')).toBeNull();
        });

        it('should decode a valid token with all fields', () => {
            const mockToken = 'valid.token.here';
            const mockDecoded = {
                sid: 'user123',
                family_name: 'Doe',
                given_name: 'John',
                preferred_username: 'johndoe',
                realm_access: { roles: ['admin', 'user'] },
                email: 'john@example.com',
                exp: 1234567890,
                phone: '1234567890',
                name: 'John Doe',
                customerAccountId: 'cust123'
            };

            (jwt_decode as jest.Mock).mockReturnValue(mockDecoded);

            const result = decodeToken(mockToken);

            expect(result).toEqual({
                id: 'user123',
                phone: '1234567890',
                name: 'John Doe',
                firstName: 'John',
                lastName: 'Doe',
                username: 'johndoe',
                role: 'admin', // first role
                token: mockToken,
                email: 'john@example.com',
                expireTime: 1234567890 * 1000,
                customerAccountId: 'cust123'
            });
            expect(jwt_decode).toHaveBeenCalledWith(mockToken);
        });

        it('should handle token with missing optional fields', () => {
            const mockToken = 'valid.token.here';
            const mockDecoded = {
                sid: 'user123',
                given_name: 'John',
                realm_access: { roles: ['user'] },
                exp: 1234567890
            };

            (jwt_decode as jest.Mock).mockReturnValue(mockDecoded);

            const result = decodeToken(mockToken);

            expect(result).toEqual({
                id: 'user123',
                phone: undefined,
                name: undefined,
                firstName: 'John',
                lastName: undefined,
                username: undefined,
                role: 'user',
                token: mockToken,
                email: undefined,
                expireTime: 1234567890 * 1000,
                customerAccountId: undefined
            });
        });

        it('should handle empty roles array', () => {
            const mockToken = 'valid.token.here';
            const mockDecoded = {
                sid: 'user123',
                given_name: 'John',
                realm_access: { roles: [] },
                exp: 1234567890
            };

            (jwt_decode as jest.Mock).mockReturnValue(mockDecoded);

            const result = decodeToken(mockToken);

            expect(result?.role).toBeUndefined();
        });
    });

    describe('formatDate', () => {

        it('should return "Invalid Date" for invalid date string', () => {
            const result = formatDate('not-a-date');
            expect(result).toBe('Invalid Date');
        });

        it('should handle empty string', () => {
            const result = formatDate('');
            expect(result).toBe('Invalid Date');
        });
    });

    describe('formatNumber', () => {
        it('should format number with 2 decimal places in French style', () => {
            expect(formatNumber(1234.567)).toMatch(/1[\s]?234,57/);
            expect(formatNumber(1000)).toMatch(/1[\s]?000,00/);
            expect(formatNumber(0.999)).toMatch(/1,00/);
            expect(formatNumber(1234567.891)).toMatch(/1[\s]?234[\s]?567,89/);
        });

        it('should handle zero', () => {
            expect(formatNumber(0)).toMatch(/0,00/);
        });

        it('should handle negative numbers', () => {
            expect(formatNumber(-1234.567)).toMatch(/-1[\s]?234,57/);
        });

        it('should handle very large numbers', () => {
            expect(formatNumber(1234567890.123)).toMatch(/1[\s]?234[\s]?567[\s]?890,12/);
        });
    });

    describe('formatNumbeer', () => {
        it('should format number to 2 decimal places', () => {
            expect(formatNumbeer(1234.567)).toBe(1234.57);
            expect(formatNumbeer(1000)).toBe(1000);
            expect(formatNumbeer(0.999)).toBe(1);
            expect(formatNumbeer(1234567.891)).toBe(1234567.89);
        });

        it('should handle zero', () => {
            expect(formatNumbeer(0)).toBe(0);
        });

        it('should handle negative numbers', () => {
            expect(formatNumbeer(-1234.567)).toBe(-1234.57);
        });

        it('should return null for null input', () => {
            expect(formatNumbeer(null)).toBeNull();
        });

        it('should return null for undefined input', () => {
            expect(formatNumbeer(undefined)).toBeNull();
        });

        it('should return null for NaN input', () => {
            expect(formatNumbeer(NaN)).toBeNull();
        });

        it('should return null for non-number input', () => {
            // @ts-ignore - testing invalid input
            expect(formatNumbeer('not a number')).toBeNull();
        });
    });

    describe('calculateRowSpan', () => {
        it('should return 1 for element without items', () => {
            expect(calculateRowSpan({})).toBe(1);
            expect(calculateRowSpan({ someProp: 'value' })).toBe(1);
        });

        it('should calculate correct row span for flat items', () => {
            const element = {
                items: [{}, {}, {}]
            };
            expect(calculateRowSpan(element)).toBe(3);
        });
    });

    describe('formatNumberByCountryCode', () => {
        it('should format number for US with currency', () => {
            const result = formatNumberByCountryCode(1234.56, 'US');
            expect(result).toMatch(/\$1,234\.56/);
        });

        it('should format number for FR with currency', () => {
            const result = formatNumberByCountryCode(1234.56, 'FR');
            expect(result).toMatch(/1[\s]?234,56\s€/);
        });

        it('should format number without currency when withCurrency is false', () => {
            const result = formatNumberByCountryCode(1234.56, 'US', false);
            expect(result).toBe('1,234.56');
        });

        it('should return only currency symbol when withAmount is false', () => {
            const result = formatNumberByCountryCode(1234.56, 'US', true, false);
            expect(result).toBe('$');

            const euroResult = formatNumberByCountryCode(1234.56, 'DE', true, false);
            expect(euroResult).toBe('€');
        });

        it('should use default formatting for unknown country code', () => {
            const result = formatNumberByCountryCode(1234.56, 'XX');
            expect(result).toMatch(/\$1,234\.56/);
        });

        it('should handle bigint values', () => {
            const result = formatNumberByCountryCode(BigInt(123456), 'US');
            expect(result).toMatch(/\$123,456/);
        });

        it('should handle error in formatting and fallback to default', () => {
            // Force an error by using an invalid country code that doesn't exist in the mapping
            const result = formatNumberByCountryCode(1234.56, 'INVALID');
            expect(result).toMatch(/\$1,234\.56/);
        });

        it('should handle different country codes', () => {
            // Test a sampling of different countries
            expect(formatNumberByCountryCode(1234.56, 'GB')).toMatch(/£1,234\.56/);
            expect(formatNumberByCountryCode(1234.56, 'CN')).toMatch(/¥1,234\.56/);
            expect(formatNumberByCountryCode(1234.56, 'RU')).toMatch(/1[\s]?234,56\s₽/);
        });
    });
});