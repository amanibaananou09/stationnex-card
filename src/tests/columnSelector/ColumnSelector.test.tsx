import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { UIColumnDefinitionType } from 'components/UI/Table/Types';
import ColumnSelectionDropdown from "../../components/ColumnSelector/ColumnSelector";

describe('ColumnSelectionDropdown', () => {
    const mockColumns: UIColumnDefinitionType<any>[] = [
        { key: '#', header: 'Number'},
        { key: 'name', header: 'Name'},
        { key: 'age', header: 'Age'},
        { key: 'email', header: 'Email'},
    ];

    let mockVisibleColumns: string[];
    let mockSetVisibleColumns: jest.Mock;
    let mockSetDisplayedColumns: jest.Mock;

    beforeEach(() => {
        mockVisibleColumns = ['#', 'name', 'age'];
        mockSetVisibleColumns = jest.fn((updater) => {
            if (typeof updater === 'function') {
                mockVisibleColumns = updater(mockVisibleColumns);
            } else {
                mockVisibleColumns = updater;
            }
        });
        mockSetDisplayedColumns = jest.fn();
        jest.clearAllMocks();
    });

    const renderComponent = (isOpen = true) => {
        return render(
            <ColumnSelectionDropdown
                columns={mockColumns}
                visibleColumns={mockVisibleColumns}
                setVisibleColumns={mockSetVisibleColumns}
                setDisplayedColumns={mockSetDisplayedColumns}
                isOpen={isOpen}
            />
        );
    };

    it('renders correctly when open', () => {
        renderComponent();

        expect(screen.getByText('Number')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Age')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();

        const numberCheckbox = screen.getByLabelText('Number') as HTMLInputElement;
        const nameCheckbox = screen.getByLabelText('Name') as HTMLInputElement;
        const ageCheckbox = screen.getByLabelText('Age') as HTMLInputElement;
        const emailCheckbox = screen.getByLabelText('Email') as HTMLInputElement;

        expect(numberCheckbox.checked).toBe(true);
        expect(nameCheckbox.checked).toBe(true);
        expect(ageCheckbox.checked).toBe(true);
        expect(emailCheckbox.checked).toBe(false);
    });

    it('does not render when closed', () => {
        const { container } = renderComponent(false);
        expect(container.querySelector('div[role="menu"]')).not.toBeInTheDocument();
    });

    it('updates displayedColumns when columns are toggled', () => {
        renderComponent();

        // Toggle email column
        fireEvent.click(screen.getByLabelText('Email'));

        // Verify setDisplayedColumns was called with expected columns
        expect(mockSetDisplayedColumns).toHaveBeenCalled();

        const lastCall = mockSetDisplayedColumns.mock.calls[mockSetDisplayedColumns.mock.calls.length - 1];
        const displayedColumns = lastCall[0];

        // Should include all columns since we toggled email which wasn't visible
        expect(displayedColumns).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ key: '#' }),
                expect.objectContaining({ key: 'name' }),
                expect.objectContaining({ key: 'age' }),
                expect.objectContaining({ key: 'email' }),
            ])
        );
    });

    it('does not render checkbox for invalid column keys', () => {
        const columnsWithInvalidKey = [
            ...mockColumns,
            { key: undefined, header: 'Invalid', accessor: () => null },
        ];

        render(
            <ColumnSelectionDropdown
                columns={columnsWithInvalidKey}
                visibleColumns={mockVisibleColumns}
                setVisibleColumns={mockSetVisibleColumns}
                setDisplayedColumns={mockSetDisplayedColumns}
                isOpen={true}
            />
        );

        expect(screen.queryByText('Invalid')).not.toBeInTheDocument();
    });
});