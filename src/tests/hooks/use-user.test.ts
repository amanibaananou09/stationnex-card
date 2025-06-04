import { useUserByName, useUserQueries } from "../../hooks/use-user";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from "../../common/api/auth-api";

jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
    useMutation: jest.fn(),
    useQueryClient: jest.fn(),
}));
jest.mock('../../common/api/auth-api', () => ({
    updateUser: jest.fn(),
}));

describe('hooks tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (updateUser as jest.Mock).mockResolvedValue({}); // mock API response
    });

    describe('useUserByName', () => {
        it('returns profile data when username is provided', () => {
            // Mock useQuery to simulate data
            (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
                expect(queryKey).toEqual(['profile', 'john']);
                return {
                    data: { id: 1, name: 'John Doe' },
                    refetch: jest.fn(),
                };
            });

            const { profile, refetch } = useUserByName('john');
            expect(profile).toEqual({ id: 1, name: 'John Doe' });
        });

        it('returns undefined profile when username is undefined', () => {
            (useQuery as jest.Mock).mockImplementation(() => ({
                data: undefined,
                refetch: jest.fn(),
            }));

            const { profile } = useUserByName(undefined);
            expect(profile).toBeUndefined();
        });
    });

    describe('useUserQueries', () => {
        it('calls mutateAsync and invalidates queries on success', async () => {
            const mockInvalidateQueries = jest.fn();
            const mockQueryClient = {
                invalidateQueries: mockInvalidateQueries,
            } as any;

            // Mock useQueryClient to return our mockQueryClient
            (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);

            // Mock useMutation to call onSuccess manually
            (useMutation as jest.Mock).mockImplementation(({ mutationFn, onSuccess }) => {
                return {
                    mutateAsync: jest.fn(async (user) => {
                        // simulate mutation execution
                        await mutationFn(user);
                        if (onSuccess) {
                            onSuccess({}, user); // manually trigger onSuccess
                        }
                        return user;
                    }),
                };
            });

            const { update } = useUserQueries();

            const user = {
                id: "42",
                name: 'Updated User',
                username: 'updateduser',
                phone: '987-654-3210',
                customerAccountId: "67890",
            };

            await update(user);

            // Check that invalidateQueries was called with correct key
            expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['profile', "42"] });
        });
    });
});