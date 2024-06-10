import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { PeriodType } from "common/enums";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePeriod } from "store/PeriodFilterContext";
import { truncateText } from "utils/utils";

const DashBoardFilter = () => {
  const { t } = useTranslation();

  const { period, setPeriod } = usePeriod();

  const [startDateTime, setStartDateTime] = useState<string>();
  const [endDateTime, setEndDateTime] = useState<string>();

  const handlePeriodChange = (periodType: PeriodType) => {
    setPeriod({ periodType });
  };

  useEffect(() => {
    setStartDateTime(period?.startDateTime);
    setEndDateTime(period?.endDateTime);
  }, [period]);

  const searchHandler = () => {
    setPeriod({
      startDateTime,
      endDateTime,
    });
  };

  //styles
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
          onClick={() => handlePeriodChange(PeriodType.TODAY)}
          size={buttonSize}
          fontSize={buttonFontSize}
          flex="2"
          color={period?.periodType === PeriodType.TODAY ? "blue.500" : "black"}
        >
          {truncateText(t("common.today"), truncatedButtonTextLimit)}
        </Button>

        <Button
          colorScheme="gray"
          onClick={() => handlePeriodChange(PeriodType.YESTERDAY)}
          size={buttonSize}
          fontSize={buttonFontSize}
          flex="2"
          color={
            period?.periodType === PeriodType.YESTERDAY ? "blue.500" : "black"
          }
        >
          {truncateText(t("common.yesterday"), truncatedButtonTextLimit)}
        </Button>

        <Button
          colorScheme="gray"
          onClick={() => handlePeriodChange(PeriodType.WEEKLY)}
          size={buttonSize}
          fontSize={buttonFontSize}
          flex="1"
          color={
            period?.periodType === PeriodType.WEEKLY ? "blue.500" : "black"
          }
        >
          {truncateText(t("common.weekly"), truncatedButtonTextLimit)}
        </Button>

        <Button
          colorScheme="gray"
          onClick={() => handlePeriodChange(PeriodType.MONTHLY)}
          size={buttonSize}
          fontSize={buttonFontSize}
          flex="1"
          color={
            period?.periodType === PeriodType.MONTHLY ? "blue.500" : "black"
          }
        >
          {truncateText(t("common.monthly"), truncatedButtonTextLimit)}
        </Button>

        <Button
          colorScheme="gray"
          onClick={() => handlePeriodChange(PeriodType.YEARLY)}
          size={buttonSize}
          fontSize={buttonFontSize}
          flex="1"
          color={
            period?.periodType === PeriodType.YEARLY ? "blue.500" : "black"
          }
        >
          {truncateText(t("common.yearly"), truncatedButtonTextLimit)}
        </Button>

        <Text
          as="h1"
          fontSize={{ sm: "sm", md: "lg" }}
          fontWeight="bold"
          textAlign="center"
          color="#FFFFFF"
        >
          {t("common.from")} :
        </Text>

        <Box>
          <Input
            type="datetime-local"
            value={startDateTime ?? period?.startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            bg="white"
            size={useBreakpointValue({ base: "xs", md: "md" })}
          />
        </Box>

        <Text
          as="h1"
          fontSize={{ sm: "sm", md: "lg" }}
          fontWeight="bold"
          textAlign="center"
          color="#FFFFFF"
        >
          {t("common.to")} :
        </Text>

        <Box>
          <Input
            type="datetime-local"
            value={endDateTime ?? period?.endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
            bg="white"
            size={useBreakpointValue({ base: "xs", md: "md" })}
          />
        </Box>

        <Button
          onClick={searchHandler}
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
