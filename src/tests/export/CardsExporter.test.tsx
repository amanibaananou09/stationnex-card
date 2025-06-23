import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import CardsExporter from "../../components/Exporter/CardsExporter";
import { GeneralCard } from "common/model";

// Mock the react-i18next translation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                "card.cardId": "Card ID",
                "card.holder": "Holder",
                "card.cardGroup": "Card Group",
                "card.expirationDate": "Expiration Date",
                "routes.cardManagement": "Card Management",
                "common.exportExcel": "Export to Excel",
                "common.exportPDF": "Export to PDF",
            };
            return translations[key] || key;
        },
        i18n: { language: 'fr' }
    })
}));

// Mock jspdf and its methods
jest.mock('jspdf', () => {
    const mockAutoTable = jest.fn();
    const mockJs = jest.fn(() => ({
        save: jest.fn(),
        setFontSize: jest.fn(),
        text: jest.fn(),
        autoTable: mockAutoTable,
        getStringUnitWidth: jest.fn((text) => text.length * 2),
        internal: {
            pageSize: { getWidth: () => 210 },
            getFontSize: () => 12,
            scaleFactor: 1,
        },
    }));

    // Add the static autoTable property
    (mockJs as any).autoTable = mockAutoTable;

    return {
        __esModule: true,
        default: mockJs,
        mockAutoTable // Export for test assertions
    };
});

// Mock xlsx and its methods
jest.mock('xlsx', () => {
    const mockJsonToSheet = jest.fn();
    const mockBookNew = jest.fn();
    const mockBookAppendSheet = jest.fn();
    const mockWriteFile = jest.fn();

    return {
        utils: {
            json_to_sheet: mockJsonToSheet,
            book_new: mockBookNew,
            book_append_sheet: mockBookAppendSheet,
        },
        writeFile: mockWriteFile,
        mockJsonToSheet,
        mockBookNew,
        mockBookAppendSheet,
        mockWriteFile
    };
});

const sampleCards: GeneralCard[] = [
    {
        id: "1",
        cardId: "123",
        holder: "John Doe",
        cardGroupName: "Group A",
        expirationDate: "2024-12-31",
        companyName: "Company X",
        codePin: "1234",
        holderPassword: "pass123",
        actif: true,
    },
    {
        id: "2",
        cardId: "456",
        holder: "Jane Smith",
        cardGroupName: "Group B",
        expirationDate: "2025-06-30",
        companyName: "Company Y",
        codePin: "5678",
        holderPassword: "pass456",
        actif: false,
    },
];

describe("CardsExporter component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders export buttons correctly', () => {
        render(<CardsExporter cards={sampleCards} />);

        expect(screen.getByText('Export to Excel')).toBeInTheDocument();
        expect(screen.getByText('Export to PDF')).toBeInTheDocument();
    });

    it('exports to Excel with correct data format', () => {
        const xlsx = require('xlsx');
        render(<CardsExporter cards={sampleCards} />);
        fireEvent.click(screen.getByText('Export to Excel'));

        const expectedExcelData = [
            {
                "#": 1,
                "Card ID": "123",
                "Holder": "John Doe",
                "Card Group": "Group A",
                "Expiration Date": "2024-12-31"
            },
            {
                "#": 2,
                "Card ID": "456",
                "Holder": "Jane Smith",
                "Card Group": "Group B",
                "Expiration Date": "2025-06-30"
            }
        ];

        expect(xlsx.utils.json_to_sheet).toHaveBeenCalledWith(expectedExcelData);
        expect(xlsx.utils.book_new).toHaveBeenCalled();
        expect(xlsx.utils.book_append_sheet).toHaveBeenCalled();
        expect(xlsx.writeFile).toHaveBeenCalled();
    });


    it('handles empty cards array', () => {
        const xlsx = require('xlsx');
        render(<CardsExporter cards={[]} />);
        fireEvent.click(screen.getByText('Export to Excel'));

        expect(xlsx.utils.json_to_sheet).toHaveBeenCalledWith([]);
    });
});