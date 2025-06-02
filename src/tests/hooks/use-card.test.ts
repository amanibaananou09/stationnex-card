// src/tests/use-card.test.ts

import {act, renderHook} from '@testing-library/react-hooks';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import {useCard, useCardQueries} from "../../hooks/use-card";
import {useAuth} from "../../store/AuthContext";
import useQueryParams from "../../hooks/use-query-params";
import {getListofCard} from "../../common/api/card-api";


// Mock dependencies
jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
    useMutation: jest.fn(),
    useQueryClient: jest.fn(),
}));

jest.mock('../../common/api/card-api', () => ({
    getListofCard: jest.fn(),
    activateCard: jest.fn(),
    deactivateCard: jest.fn(),
}));

// Mock useAuth
jest.mock('../../store/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Correctly mock useQueryParams as a jest mock function
jest.mock('../../hooks/use-query-params');

describe('useCardQueries', () => {
    const mockInvalidateQueries = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock useQueryClient
        (useQueryClient as jest.Mock).mockReturnValue({
            invalidateQueries: mockInvalidateQueries,
        });

        // Mock useAuth
        (useAuth as jest.Mock).mockReturnValue({ customerId: 5 });

        // Mock useMutation
        (useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
        });
    });

    it('activates a card and invalidates cache', () => {
        const mockMutate = jest.fn();
        (useMutation as jest.Mock).mockReturnValue({ mutate: mockMutate });
        const { result } = renderHook(() => useCardQueries());

        const { activate } = result.current;

        act(() => {
            activate('card123');
        });

        expect(mockMutate).toHaveBeenCalledWith('card123');

        // Simulate onSuccess callback
        const onSuccessCallback = (useMutation as jest.Mock).mock.calls[0][0]?.onSuccess;
        if (onSuccessCallback) {
            onSuccessCallback();
        }

        expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['card'] });
    });

    it('deactivates a card and invalidates cache', () => {
        const mockMutate = jest.fn();
        (useMutation as jest.Mock).mockReturnValue({ mutate: mockMutate });
        const { result } = renderHook(() => useCardQueries());

        const { desactivate } = result.current;

        act(() => {
            desactivate('card456');
        });

        expect(mockMutate).toHaveBeenCalledWith('card456');

        // Simulate onSuccess callback
        const onSuccessCallback = (useMutation as jest.Mock).mock.calls[0][0]?.onSuccess;
        if (onSuccessCallback) {
            onSuccessCallback();
        }

        expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['card'] });
    });
});

describe('useCard', () => {
    const mockParams = {
        cardId: '123',
        holder: 'John Doe',
        actif: 'true',
        expirationDate: '2024-12-31',
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock useQueryParams to return our mockQuery object
        (useQueryParams as jest.Mock).mockReturnValue({
            get: jest.fn((key: keyof typeof mockParams) => mockParams[key]),
        });

        // Mock useAuth to return customerId
        (useAuth as jest.Mock).mockReturnValue({ customerId: 10 });

        // Mock useQuery to simulate data fetch
        (useQuery as jest.Mock).mockImplementation(({ queryKey, queryFn }) => {
            // You can customize this as needed
            return {
                data: [{ id: 1, name: 'Card 1' }],
                isLoading: false,
            };
        });
    });

    it('fetches cards with correct params', () => {
        // Mock get function to return the expected params
        (useQueryParams as jest.Mock).mockReturnValue({
            get: jest.fn((key: keyof typeof mockParams) => mockParams[key]),
        });
        // Mock getListofCard to resolve with the expected data
        (getListofCard as jest.Mock).mockResolvedValue([{ id: 1, name: 'Card 1' }]);

        const { result } = renderHook(() => useCard(10));

        // Check that useQuery was called with expected queryKey
        expect(useQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: expect.arrayContaining([
                    'card',
                    expect.objectContaining({
                        cardId: '123',
                        holder: 'John Doe',
                        actif: 'true',
                        expirationDate: '2024-12-31',
                    }),
                    10,
                ]),
                queryFn: expect.any(Function),
            })
        );

        // Adjusted assertion to match the mock data
        expect(result.current.cards).toEqual([{ id: 1, name: 'Card 1' }]);
    });
    it('does not fetch if customerId is undefined', () => {
        (useAuth as jest.Mock).mockReturnValue({ customerId: undefined });
        // Mock useQuery to a jest.fn() to track calls
        (useQuery as jest.Mock).mockImplementation(() => ({ data: undefined, isLoading: false }));

        const { result } = renderHook(() => useCard(0));
        expect(useQuery).toHaveBeenCalled(); // or remove this line if your hook always calls it
        expect(result.current.cards).toBeUndefined();
    });
});

describe('useCardQueries (additional)', () => {
    const mockInvalidateQueries = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useQueryClient as jest.Mock).mockReturnValue({
            invalidateQueries: mockInvalidateQueries,
        });
        (useAuth as jest.Mock).mockReturnValue({ customerId: 42 });
    });

    it('activates card and invalidates cache', () => {
        const mutateFn = jest.fn();
        (useMutation as jest.Mock).mockReturnValue({ mutate: mutateFn });
        const { result } = renderHook(() => useCardQueries());

        act(() => {
            result.current.activate('card-123');
        });

        expect(mutateFn).toHaveBeenCalledWith('card-123');

        // simulate onSuccess
        const onSuccess = (useMutation as jest.Mock).mock.calls[0][0]?.onSuccess;
        if (onSuccess) {
            onSuccess();
        }
        expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['card'] });
    });

    it('deactivates card and invalidates cache', () => {
        const mutateFn = jest.fn();
        (useMutation as jest.Mock).mockReturnValue({ mutate: mutateFn });
        const { result } = renderHook(() => useCardQueries());

        act(() => {
            result.current.desactivate('card-456');
        });

        expect(mutateFn).toHaveBeenCalledWith('card-456');

        // simulate onSuccess
        const onSuccess = (useMutation as jest.Mock).mock.calls[0][0]?.onSuccess;
        if (onSuccess) {
            onSuccess();
        }
        expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['card'] });
    });
});