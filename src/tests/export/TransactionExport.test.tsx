import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {useTranslation} from 'react-i18next';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import TransactionsExporter from "../../components/Exporter/TransactionsExport";
import {Transaction} from "../../common/model";
// Mock dependencies
jest.mock('react-i18next');
// Configuration du mock
jest.mock('jspdf', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        save: jest.fn(),
        setFontSize: jest.fn(),
        text: jest.fn(),
        autoTable: jest.fn(),
        internal: {
            pageSize: { getWidth: () => 210 },
            getFontSize: () => 12,
            scaleFactor: 1
        }
    }))
}));

const mockSave = jest.fn();
const mockJsPDF = {
    save: mockSave,
    setFontSize: jest.fn(),
    text: jest.fn(),
    autoTable: jest.fn(),
    internal: {
        pageSize: { getWidth: () => 210 },
        getFontSize: () => 12,
        scaleFactor: 1
    }
};

(jsPDF as unknown as jest.Mock).mockImplementation(() => mockJsPDF);



jest.mock('jspdf-autotable');
jest.mock('xlsx');

// Mock transaction data
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

describe('TransactionsExporter', () => {
    beforeEach(() => {
        (useTranslation as jest.Mock).mockReturnValue({
            t: (key: string) => key, // Returns translation key directly
            i18n: { language: 'fr' }
        });
    });

    it('renders export buttons correctly', () => {
        render(
            <TransactionsExporter
                transactions={mockTransactions}
                isLoading={false}
            />
        );

        expect(screen.getByText('common.exportExcel')).toBeInTheDocument();
        expect(screen.getByText('common.exportPDF')).toBeInTheDocument();
    });

    it('handles PDF export correctly', () => {
        // Mock jsPDF
        const mockSave = jest.fn();
        (jsPDF as unknown as jest.Mock).mockImplementation(() => ({
            save: mockSave,
            internal: {
                pageSize: {
                    getWidth: () => 210
                },
                getFontSize: () => 12,
                scaleFactor: 1
            },
            setFontSize: jest.fn(),
            text: jest.fn(),
            line: jest.fn(),
            autoTable: jest.fn()
        }));

        render(
            <TransactionsExporter
                transactions={mockTransactions}
                isLoading={false}
            />
        );

        const pdfButton = screen.getByText('common.exportPDF');
        fireEvent.click(pdfButton);

        // Verify jsPDF initialization
        expect(jsPDF).toHaveBeenCalled();

        // Verify autoTable is called with correct data
        const mockDocInstance = (jsPDF as unknown as jest.Mock).mock.results[0].value;
        expect(mockDocInstance.autoTable).toHaveBeenCalledWith({
            head: expect.any(Array),
            body: expect.any(Array),
            startY: 20,
            styles: { fontSize: 5 },
            addPageContent: expect.any(Function)
        });

        // Verify PDF is saved
        expect(mockSave).toHaveBeenCalledWith('routes.transactions.pdf');
    });

    it('handles empty transactions array', () => {
        render(
            <TransactionsExporter
                transactions={[]}
                isLoading={false}
            />
        );

        const excelButton = screen.getByText('common.exportExcel');
        fireEvent.click(excelButton);

        // Verify XLSX utils is called with empty array
        expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith([]);
    });
});
