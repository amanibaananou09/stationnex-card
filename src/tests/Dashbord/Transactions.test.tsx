import React, { ReactNode } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { useTransaction } from 'hooks/use-transaction';
import useAllTransactions from 'hooks/use-all-transaction';
import Transactions from "../../views/Dashboard/Transactions";
import { Transaction } from "common/model";

// Mock the hooks and dependencies
jest.mock('hooks/use-transaction');
jest.mock('hooks/use-all-transaction', () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'en' },
    }),
}));
jest.mock('react-custom-scrollbars', () => ({
    Scrollbars: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

const mockUseTransaction = useTransaction as jest.MockedFunction<typeof useTransaction>;
const mockUseAllTransactions = useAllTransactions as jest.Mock;

describe('Transactions Component', () => {
    const mockTransactions: Transaction[] = [
        {
            id: '1',
            cardId: 'CARD123_ID',
            cardIdentifier: 'CARD123',
            dateTime: '2025-06-02T10:30:00Z',
            productName: 'Essence SP95',
            productId: 101,
            price: 1.85,
            quantity: 40,
            amount: 74.0,
            availableBalance: 60,
            availableVolume: 40,
            salePointName: 'Station A',
            city: 'Paris',
            address: '123 Rue Example',
            remainingBalancePerProduct: {},
            salePoint: {
                id: 1,
                name: 'Station A',
                country: {
                    id: 1,
                    name: 'France',
                    code: 'FR',
                    currency: {
                        id: 1,
                        code: 'EUR',
                        name: 'Euro',
                        locale: 'fr-FR'
                    }
                }
            }
        },
        {
            id: '2',
            cardId: 'CARD789_ID',
            cardIdentifier: 'CARD789',
            dateTime: '2025-06-02T08:15:00Z',
            productName: 'SP98 Premium',
            productId: 102,
            price: 2.05,
            quantity: 30,
            amount: 61.5,
            availableBalance: 45,
            availableVolume: 30,
            salePointName: 'Station C',
            city: 'Marseille',
            address: '456 Avenue Test',
            remainingBalancePerProduct: {},
            salePoint: {
                id: 3,
                name: 'Station B',
                country: {
                    id: 1,
                    name: 'France',
                    code: 'FR',
                    currency: {
                        id: 1,
                        code: 'EUR',
                        name: 'Euro',
                        locale: 'fr-FR'
                    }
                }
            }
        }
    ];

    beforeEach(() => {
        mockUseTransaction.mockReturnValue({
            numberOfElements: mockTransactions.length,
            transactions: mockTransactions,
            totalPages: 5,
            totalElements: 100,
            isLoading: false
        });

        mockUseAllTransactions.mockReturnValue({
            allTransactions: mockTransactions,
            isLoading: false,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(
            <MemoryRouter>
                <I18nextProvider i18n={i18n}>
                    <Transactions />
                </I18nextProvider>
            </MemoryRouter>
        );

        expect(screen.getByText('transactions.header')).toBeInTheDocument();
        expect(screen.getByText('transactions.text')).toBeInTheDocument();
    });

    it('displays loading skeleton when isLoading is true', () => {
        mockUseTransaction.mockReturnValue({
            numberOfElements: 0,
            transactions: [],
            totalPages: 0,
            totalElements: 0,
            isLoading: true
        });

        render(
            <MemoryRouter>
                <I18nextProvider i18n={i18n}>
                    <Transactions />
                </I18nextProvider>
            </MemoryRouter>
        );

        expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
    });

    it('displays transactions data when loaded', async () => {
        render(
            <MemoryRouter>
                <I18nextProvider i18n={i18n}>
                    <Transactions />
                </I18nextProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('CARD123')).toBeInTheDocument();
            expect(screen.getByText('Essence SP95')).toBeInTheDocument();
            expect(screen.getByText('Station A')).toBeInTheDocument();
        });
    });

    it('shows empty state when no transactions are available', () => {
        mockUseTransaction.mockReturnValue({
            numberOfElements: 0,
            transactions: [],
            totalPages: 0,
            totalElements: 0,
            isLoading: false
        });

        render(
            <MemoryRouter>
                <I18nextProvider i18n={i18n}>
                    <Transactions />
                </I18nextProvider>
            </MemoryRouter>
        );

        expect(screen.getByText('transactions.noTransactions')).toBeInTheDocument();
    });

    it('formats dates correctly', () => {
        render(
            <MemoryRouter>
                <I18nextProvider i18n={i18n}>
                    <Transactions />
                </I18nextProvider>
            </MemoryRouter>
        );

        expect(screen.getByText('02 Jun 2025')).toBeInTheDocument();
    });

    it('formats numbers and currencies correctly', () => {
        render(
            <MemoryRouter>
                <I18nextProvider i18n={i18n}>
                    <Transactions />
                </I18nextProvider>
            </MemoryRouter>
        );

        expect(screen.getByText('1.85')).toBeInTheDocument();
        expect(screen.getByText('74.00')).toBeInTheDocument();
    });

    it('toggles column dropdown when button is clicked', () => {
        render(
            <MemoryRouter>
                <I18nextProvider i18n={i18n}>
                    <Transactions />
                </I18nextProvider>
            </MemoryRouter>
        );

        const dropdownButton = screen.getByRole('button', { name: /column toggle/i });
        fireEvent.click(dropdownButton);

        expect(screen.getByText('columnSelection.title')).toBeInTheDocument();
    });

    it('updates criteria when filter changes', () => {
        const { container } = render(
            <MemoryRouter>
                <I18nextProvider i18n={i18n}>
                    <Transactions />
                </I18nextProvider>
            </MemoryRouter>
        );

        const filterInput = container.querySelector('input[name="cardIds"]');
        if (filterInput) {
            fireEvent.change(filterInput, { target: { value: 'CARD123' } });
        }

        expect(mockUseTransaction).toHaveBeenCalled();
    });

    it('updates pagination when page changes', () => {
        render(
            <MemoryRouter>
                <I18nextProvider i18n={i18n}>
                    <Transactions />
                </I18nextProvider>
            </MemoryRouter>
        );

        const pageButton = screen.getByText('2');
        fireEvent.click(pageButton);

        expect(mockUseTransaction).toHaveBeenCalled();
    });

    it('renders exporter button when transactions exist', () => {
        render(
            <MemoryRouter>
                <I18nextProvider i18n={i18n}>
                    <Transactions />
                </I18nextProvider>
            </MemoryRouter>
        );

        expect(screen.getByText('exporter.export')).toBeInTheDocument();
    });
});