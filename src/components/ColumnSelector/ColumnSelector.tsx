import React from "react";
import { Checkbox, Flex, Box } from "@chakra-ui/react";
import { UIColumnDefinitionType } from "components/UI/Table/Types";

interface ColumnSelectionDropdownProps {
  columns: UIColumnDefinitionType<any>[];
  invisibleColumns: string[];
  setInvisibleColumns: React.Dispatch<React.SetStateAction<string[]>>;
  setShowColumns: React.Dispatch<
    React.SetStateAction<UIColumnDefinitionType<any>[]>
  >;
  isOpen: boolean;
  onClose: () => void;
}

const ColumnSelectionDropdown = ({
  columns,
  invisibleColumns,
  setInvisibleColumns,
  setShowColumns,
  isOpen,
  onClose,
}: ColumnSelectionDropdownProps) => {
  const toggleColumnVisibility = (columnKey: string | undefined) => {
    if (columnKey) {
      setInvisibleColumns((previnvisibleColumns) => {
        const isColumnKeyVisible = previnvisibleColumns.includes(columnKey);
        const updatedinvisibleColumns = isColumnKeyVisible
          ? previnvisibleColumns.filter((key) => key !== columnKey)
          : [...previnvisibleColumns, columnKey];
        // Update showColumns based on updatedinvisibleColumns
        const updatedshowColumns = columns.filter((col) =>
          updatedinvisibleColumns.includes(col.key as string),
        ) as UIColumnDefinitionType<any>[];

        if (updatedshowColumns.length === 0) {
          setShowColumns(columns);
        } else {
          setShowColumns([...updatedshowColumns]);
        }
        onClose();
        return updatedinvisibleColumns;
      });
    }
  };

  return (
    <Flex justifyContent="flex-end" position="relative">
      {isOpen && (
        <Box
          position="absolute"
          margin="100px 0px"
          right="0"
          bg="white"
          border="1px solid"
          borderColor="gray.300"
          borderRadius="md"
          p="2"
          zIndex="100"
          display="flex"
          flexDirection="column"
        >
          {columns.map((col) => {
            if (typeof col.key === "string") {
              return (
                <Checkbox
                  key={col.key}
                  isChecked={invisibleColumns.includes(col.key)}
                  onChange={() => toggleColumnVisibility(col.key)}
                >
                  {col.header}
                </Checkbox>
              );
            }
            return null;
          })}
        </Box>
      )}
    </Flex>
  );
};

export default ColumnSelectionDropdown;
