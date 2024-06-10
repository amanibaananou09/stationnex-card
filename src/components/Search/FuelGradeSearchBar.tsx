import { Box, Button, Flex, Heading, Input, Select } from "@chakra-ui/react";
import { PriceModificationRequestCreteria } from "common/model";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

type FuelGradeSearchBarProps = {
  onSubmit: (creteria: PriceModificationRequestCreteria) => void;
};

const FuelGradeSearchBar = ({ onSubmit }: FuelGradeSearchBarProps) => {
  const { t } = useTranslation();

  const searchTerm = useRef<HTMLInputElement>(null);
  const filterType = useRef<HTMLSelectElement>(null);
  const startDate = useRef<HTMLInputElement>(null);
  const endDate = useRef<HTMLInputElement>(null);

  return (
    <Box overflowX={{ sm: "scroll", xl: "hidden" }} my="20px">
      <Flex direction="row" gap={3} alignItems="center">
        <Select ref={filterType} flex={2}>
          <option>{t("fuelGrades.type")}</option>
          <option value="fuelName">{t("fuelGrades.fuelName")}</option>
          <option value="requesterName">{t("fuelGrades.requesterName")}</option>
          <option value="price">{t("fuelGrades.price")}</option>
        </Select>

        <Input placeholder={t("common.search")} ref={searchTerm} flex={2} />

        <Heading as="h1" fontSize="md" ml="2" alignItems="center">
          {t("common.from")}:
        </Heading>

        <Input type="datetime-local" ref={startDate} flex={2} />

        <Heading as="h1" fontSize="md" ml="2" alignItems="center">
          {t("common.to")}:
        </Heading>

        <Input type="datetime-local" ref={endDate} flex={2} />

        <Button
          flex={1}
          colorScheme="telegram"
          size="md"
          onClick={() =>
            onSubmit({
              searchTerm: searchTerm.current?.value,
              type: filterType.current?.value,
              startDate: startDate.current?.value,
              endDate: endDate.current?.value,
            })
          }
        >
          {t("common.search")}
        </Button>
      </Flex>
    </Box>
  );
};

export default React.memo(FuelGradeSearchBar);
