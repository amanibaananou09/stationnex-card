import jwt_decode from 'jwt-decode';
import {
    calculateRowSpan,
    decodeToken,
    formatDate,
    formatNumbeer,
    formatNumber,
    formatNumberByCountryCode,
    truncateText
} from 'utils/utils';

// Mock jwt_decode
jest.mock('jwt-decode');

describe('Utility Functions', () => {
    describe('decodeToken', () => {
        it('should return null for null token', () => {
            expect(decodeToken(null)).toBeNull();
        });

        it('should decode a valid token', () => {
            const mockToken = 'mock.token.here';
            const mockDecoded = {
                sid: 'user123',
                family_name: 'Doe',
                given_name: 'John',
                preferred_username: 'johndoe',
                realm_access: { roles: ['admin'] },
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
                role: 'admin',
                token: mockToken,
                email: 'john@example.com',
                expireTime: 1234567890 * 1000,
                customerAccountId: 'cust123'
            });
            expect(jwt_decode).toHaveBeenCalledWith(mockToken);
        });

        it('should handle missing optional fields', () => {
            const mockToken = 'mock.token.here';
            const mockDecoded = {
                sid: 'user123',
                family_name: 'Doe',
                given_name: 'John',
                preferred_username: 'johndoe',
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
                lastName: 'Doe',
                username: 'johndoe',
                role: 'user',
                token: mockToken,
                email: undefined,
                expireTime: 1234567890 * 1000,
                customerAccountId: undefined
            });
        });
    });

    describe('formatDate', () => {
        it('should handle invalid date', () => {
            const result = formatDate('invalid-date');
            expect(result).toBe('Invalid Date');
        });
    });

    describe('formatNumber', () => {
        it('should format number with 2 decimal places in French style', () => {
            expect(formatNumber(1234.567)).toBe('1 234,57'); // Note: The exact whitespace character might vary
            expect(formatNumber(1000)).toBe('1 000,00');
            expect(formatNumber(0.999)).toBe('1,00');
        });
    });

    describe('formatNumbeer', () => {
        it('should format number to 2 decimal places', () => {
            expect(formatNumbeer(1234.567)).toBe(1234.57);
            expect(formatNumbeer(1000)).toBe(1000);
            expect(formatNumbeer(0.999)).toBe(1);
        });
    });

    describe('truncateText', () => {
        it('should return original text if shorter than limit', () => {
            expect(truncateText('Hello', 10)).toBe('Hello');
        });

        it('should truncate text longer than limit', () => {
            expect(truncateText('Hello World', 5)).toBe('Hello...');
        });

        it('should handle empty string', () => {
            expect(truncateText('', 5)).toBe('');
        });
    });

    describe('calculateRowSpan', () => {
        it('should return 1 for element without items', () => {
            expect(calculateRowSpan({})).toBe(1);
        });

        it('should calculate correct row span for nested items', () => {
            const element = {
                items: [
                    {},
                    {
                        items: [{}, {}]
                    },
                    {}
                ]
            };
            expect(calculateRowSpan(element)).toBe(4);
        });
    });

    describe('formatNumberByCountryCode', () => {
        it('should format number for US with currency', () => {
            const result = formatNumberByCountryCode(1234.56, 'US');
            expect(result).toBe('$1,234.56');
        });

        it('should format number for FR with currency', () => {
            const result = formatNumberByCountryCode(1234.56, 'FR');
            expect(result).toBe('1 234,56 €'); // Note: The exact whitespace characters might vary
        });

        it('should format number without currency when withCurrency is false', () => {
            const result = formatNumberByCountryCode(1234.56, 'US', false);
            expect(result).toBe('1,234.56');
        });

        it('should return only currency symbol when withAmount is false', () => {
            const result = formatNumberByCountryCode(1234.56, 'US', true, false);
            expect(result).toBe('$');
        });

        it('should use default formatting for unknown country code', () => {
            const result = formatNumberByCountryCode(1234.56, 'XX');
            expect(result).toBe('$1,234.56');
        });
    });
});