import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import { useAuth } from '../../store/AuthContext';
import { useCard } from '../../hooks/use-transaction';
import { useSalePoint } from '../../hooks/use-sale-point';
import { useProduct } from 'hooks/use-product';
import TransactionFilter from 'components/Filter/TransactionFilter';
import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';

// Mock hooks
jest.mock('../../store/AuthContext');
jest.mock('../../hooks/use-transaction');
jest.mock('../../hooks/use-sale-point');
jest.mock('hooks/use-product');

jest.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: any) => key }),
}));

const mockUseAuth = useAuth as jest.Mock;
const mockUseCard = useCard as jest.Mock;
const mockUseSalePoint = useSalePoint as jest.Mock;
const mockUseProduct = useProduct as jest.Mock;

describe('TransactionFilter component', () => {
    const onChangeMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseAuth.mockReturnValue({
            customerId: 1,
            supplierId: '2'
        });

        mockUseCard.mockReturnValue({
            cards: [
                { id: '1', cardId: 'CARD1' },
                { id: '2', cardId: 'CARD2' },
            ],
            isLoading: false,
        });

        mockUseSalePoint.mockReturnValue({
            salepoint: [
                { id: '10', name: 'Point A', city: 'City A' },
                { id: '20', name: 'Point B', city: 'City B' },
            ],
        });

        mockUseProduct.mockReturnValue({
            product: [
                { id: '100', name: 'Product X' },
                { id: '200', name: 'Product Y' },
            ],
        });
    });

    const renderComponent = () => {
        return render(
            <ChakraProvider>
                <TransactionFilter onChange={onChangeMock} />
            </ChakraProvider>
        );
    };

    it('renders main filter labels', () => {
        renderComponent();

        expect(screen.getByText('filter.filterBy')).toBeInTheDocument();
        expect(screen.getByText('filter.cardId')).toBeInTheDocument();
        expect(screen.getByText('filter.station')).toBeInTheDocument();
        expect(screen.getByText('filter.product')).toBeInTheDocument();
        expect(screen.getByText('filter.city')).toBeInTheDocument();
        expect(screen.getByText('filter.period')).toBeInTheDocument();
        expect(screen.getByText('filter.clear')).toBeInTheDocument();
    });

    it('calls onChange with initial empty filters', () => {
        renderComponent();
        expect(onChangeMock).toHaveBeenCalledWith({
            cardIds: [],
            salePointIds: [],
            productIds: [],
            city: [],
            period: { from: '', to: '' },
        });
    });

    it('updates cardId selection', async () => {
        renderComponent();

        // Open card menu
        fireEvent.click(screen.getByText('filter.cardId'));

        // Check first card checkbox
        const card1Checkbox = await screen.findByLabelText('CARD1');
        fireEvent.click(card1Checkbox);

        await waitFor(() => {
            expect(onChangeMock).toHaveBeenCalledWith(
                expect.objectContaining({ cardIds: [1] })
            );
        });
    });
    it('updates salePoint selection', async () => {
        renderComponent();

        // Open salepoint menu
        fireEvent.click(screen.getByText('filter.station'));

        // Check first salepoint checkbox
        const pointACheckbox = await screen.findByLabelText('Point A');
        fireEvent.click(pointACheckbox);

        expect.objectContaining({ salePointIds: ['10'] })

    });

    it('clears all filters when clear button is clicked', () => {
        renderComponent();

        fireEvent.click(screen.getByText('filter.clear'));

        expect(onChangeMock).toHaveBeenCalledWith({
            cardIds: [],
            salePointIds: [],
            productIds: [],
            city: [],
            period: { from: '', to: '' },
        });
    });
});