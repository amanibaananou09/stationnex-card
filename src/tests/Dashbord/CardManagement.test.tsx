import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { useCard, useCardQueries } from 'hooks/use-card';
import { useAuth } from '../../store/AuthContext';
import CardManagement from "../../views/Dashboard/CardManagement";
import {GeneralCard, User} from "common/model";
import {AuthContextProps} from "common/react-props";

// Properly type the mocks
jest.mock('hooks/use-card');
jest.mock('../../store/AuthContext');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseCard = useCard as jest.MockedFunction<typeof useCard>;
const mockUseCardQueries = useCardQueries as jest.MockedFunction<typeof useCardQueries>;

// Mock other dependencies
jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'en' },
    }),
}));

jest.mock('react-custom-scrollbars', () => ({
    Scrollbars: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('CardManagement Component', () => {
    const mockCards : GeneralCard[] = [
        {
            id: '1',
            cardId: 'CARD123',
            holder: 'John Doe',
            cardGroupName: 'Premium',
            expirationDate: '2025-12-31',
            actif: true,
            companyName: "Company X",
            codePin: "1234",
            holderPassword: "pass123",
        },
        {
            id: '2',
            cardId: 'CARD456',
            holder: 'Jane Smith',
            cardGroupName: 'Standard',
            expirationDate: '2024-06-30',
            actif: false,
            companyName: "Company Y",
            codePin: "5678",
            holderPassword: "pass456",
        },
    ];

    beforeEach(() => {
        mockUseAuth.mockReturnValue({
            customerId: 123,
            // Only include properties that exist in AuthContextProps
            isSignedIn: false,
            signIn: jest.fn(),
            signOut: jest.fn(),
            supplierId: 0,
            token: null,
            user: null,
            login: jest.fn(),
            logout: jest.fn(),
        } as AuthContextProps);

        mockUseCard.mockReturnValue({
            cards: mockCards,
            isLoading: false,
        });

        mockUseCardQueries.mockReturnValue({
            activate: jest.fn(),
            desactivate: jest.fn(),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(
            <MemoryRouter>
                <I18nextProvider i18n={i18n}>
                    <CardManagement />
                </I18nextProvider>
            </MemoryRouter>
        );

        expect(screen.getByText('card.cardId')).toBeInTheDocument();
        expect(screen.getByText('card.holder')).toBeInTheDocument();
    });

    it('displays cards data when loaded', async () => {
        render(
            <MemoryRouter>
                <I18nextProvider i18n={i18n}>
                    <CardManagement />
                </I18nextProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('CARD123')).toBeInTheDocument();
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Premium')).toBeInTheDocument();
        });
    });

    it('shows empty state when no cards are available', () => {
        mockUseCard.mockReturnValue({
            cards: [],
            isLoading: false,
        });

        render(
            <MemoryRouter>
                <I18nextProvider i18n={i18n}>
                    <CardManagement />
                </I18nextProvider>
            </MemoryRouter>
        );

        expect(screen.getByText('cardManagement.isLoading')).toBeInTheDocument();
    });

    it('formats expiration date correctly', () => {
        render(
            <MemoryRouter>
                <I18nextProvider i18n={i18n}>
                    <CardManagement />
                </I18nextProvider>
            </MemoryRouter>
        );

        expect(screen.getByText('31 DEC 2025')).toBeInTheDocument();
        expect(screen.getByText('30 JUN 2024')).toBeInTheDocument();
    });
});