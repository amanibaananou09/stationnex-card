import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { PeriodType } from "common/enums";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { truncateText } from "utils/utils";
import moment from "moment";

interface FilterPeriodProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  onSearch: (fromDate: string, toDate: string) => void;
}

export const getDefaultDates = (filter: string) => {
  let fromDate: moment.Moment;
  let toDate: moment.Moment;

  switch (filter) {
    case "today":
      fromDate = moment().startOf("day");
      toDate = moment().endOf("day");
      break;
    case "yesterday":
      fromDate = moment().subtract(1, "days").startOf("day");
      toDate = moment().subtract(1, "days").endOf("day");
      break;
    case "weekly":
      fromDate = moment().startOf("isoWeek");
      toDate = moment().endOf("isoWeek");
      break;
    case "monthly":
      fromDate = moment().startOf("month");
      toDate = moment().endOf("month");
      break;
    default:
      fromDate = moment();
      toDate = moment();
      break;
  }

  return {
    fromDate: fromDate.format("YYYY-MM-DDTHH:mm"),
    toDate: toDate.format("YYYY-MM-DDTHH:mm"),
  };
};

const DashBoardFilter = (props: FilterPeriodProps) => {
  const { t } = useTranslation();
  const { selectedFilter, onFilterChange, onSearch } = props;

  const { fromDate: defaultFromDate, toDate: defaultToDate } =
    getDefaultDates(selectedFilter);

  const [fromDate, setFromDate] = useState<string>(defaultFromDate);
  const [toDate, setToDate] = useState<string>(defaultToDate);

  const handleFilterChange = (filter: string) => {
    const { fromDate, toDate } = getDefaultDates(filter);
    setFromDate(fromDate);
    setToDate(toDate);
    onFilterChange(filter);
  };

  const handleFromDateChange = (date: string) => setFromDate(date);
  const handleToDateChange = (date: string) => setToDate(date);
  const searchFilters = () => {
    onSearch(fromDate, toDate);
  };

  // styles
  const buttonSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });
  const buttonFontSize = useBreakpointValue({
    base: "sm",
    md: "md",
    lg: "lg",
    xl: "xl",
  });
  const buttonTextLimit = useBreakpointValue({ base: 1, md: 4, lg: 8, xl: 12 });
  const defaultButtonTextLimit = 10;
  const truncatedButtonTextLimit = buttonTextLimit || defaultButtonTextLimit;

  return (
    <Box p={1}>
      <Flex alignItems="baseline" flexWrap="wrap" gap="3">
        <Button
          colorScheme="gray"
          onClick={() => handleFilterChange("today")}
          size={buttonSize}
          fontSize={buttonFontSize}
          flex="2"
          color={selectedFilter === PeriodType.TODAY ? "blue.500" : "black"}
        >
          {truncateText(t("common.today"), truncatedButtonTextLimit)}
        </Button>

        <Button
          colorScheme="gray"
          onClick={() => handleFilterChange("yesterday")}
          size={buttonSize}
          fontSize={buttonFontSize}
          flex="2"
          color={selectedFilter === PeriodType.YESTERDAY ? "blue.500" : "black"}
        >
          {truncateText(t("common.yesterday"), truncatedButtonTextLimit)}
        </Button>

        <Button
          colorScheme="gray"
          onClick={() => handleFilterChange("weekly")}
          size={buttonSize}
          fontSize={buttonFontSize}
          flex="1"
          color={selectedFilter === PeriodType.WEEKLY ? "blue.500" : "black"}
        >
          {truncateText(t("common.weekly"), truncatedButtonTextLimit)}
        </Button>

        <Button
          colorScheme="gray"
          onClick={() => handleFilterChange("monthly")}
          size={buttonSize}
          fontSize={buttonFontSize}
          flex="1"
          color={selectedFilter === PeriodType.MONTHLY ? "blue.500" : "black"}
        >
          {truncateText(t("common.monthly"), truncatedButtonTextLimit)}
        </Button>

        <Text
          as="h1"
          fontSize={{ sm: "sm", md: "lg" }}
          fontWeight="bold"
          textAlign="center"
          color="black"
        >
          {t("common.from")} :
        </Text>

        <Box>
          <Input
            type="datetime-local"
            value={fromDate}
            onChange={(e) => handleFromDateChange(e.target.value)}
            bg="white"
            size={useBreakpointValue({ base: "xs", md: "md" })}
          />
        </Box>

        <Text
          as="h1"
          fontSize={{ sm: "sm", md: "lg" }}
          fontWeight="bold"
          textAlign="center"
          color="black"
        >
          {t("common.to")} :
        </Text>

        <Box>
          <Input
            type="datetime-local"
            value={toDate}
            onChange={(e) => handleToDateChange(e.target.value)}
            bg="white"
            size={useBreakpointValue({ base: "xs", md: "md" })}
          />
        </Box>

        <Button
          onClick={searchFilters}
          colorScheme="telegram"
          size={buttonSize}
        >
          {t("common.search")}
        </Button>
      </Flex>
    </Box>
  );
};

export default DashBoardFilter;
