import { Flex, Text } from "@chakra-ui/react";
import Card from "components/Card/Card";
import DashBoardFilter from "components/Filter/DashBoardFilter";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PeriodFilterContextProvider } from "store/PeriodFilterContext";
import Fuelvolume from "../../components/Charts/Fuelvolume";
import SumfuelvolumeCard from "../../components/Charts/VolumeCard";

export default function Dashboard() {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState<string>("today");
  const [isSticky, setIsSticky] = useState(false);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (stickyRef.current) {
        setIsSticky(window.pageYOffset > stickyRef.current.offsetTop);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //styles
  const textColor = "gray.700";
  const stickyStyles: React.CSSProperties = {
    width: isSticky ? "80%" : "auto",
    position: isSticky ? "fixed" : "static",
    top: isSticky ? "2%" : "auto",
    left: isSticky ? "59%" : "auto",
    transform: isSticky ? "translateX(-50%)" : "none",
    borderRadius: "0px",
    zIndex: isSticky ? 1000 : "auto",
    backgroundColor: isSticky ? "#1c3264" : "transparent",
    padding: isSticky ? "5px" : "0",
    boxShadow: isSticky ? "0px 7px 23px rgba(0, 0, 0, 0.05)" : "none",
  };

  const handleSearchFilters = (fromDate: string, toDate: string) => {
    setFromDate(fromDate);
    setToDate(toDate);
    setSelectedFilter("");
  };
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };
  return (
    <PeriodFilterContextProvider>
      <Flex flexDirection="column">
        <Text color={textColor} fontSize="xl" fontWeight="bold" mt={20}>
          {t("dashboard.header")}
        </Text>
        <Text color={textColor} fontSize="xl" fontWeight="bold">
          {t("dashboard.text")}
        </Text>
      </Flex>
      <Flex
        flexDirection="column"
        pt={{ base: "50px", md: "65px" }}
        px={{ base: "1vw", md: "1vw", lg: "1vw" }}
      >
        <div ref={stickyRef} style={stickyStyles}>
          <DashBoardFilter
            selectedFilter={selectedFilter}
            onFilterChange={handleFilterChange}
            onSearch={handleSearchFilters}
          />
        </div>

        <Flex mt="30px">
          <Card my="5">
            <Text
              color={textColor}
              fontSize="lg"
              fontWeight="bold"
              textAlign="center"
            ></Text>

            <Fuelvolume
              periode={selectedFilter}
              startDate={fromDate}
              endDate={toDate}
            />
          </Card>
        </Flex>
        <Flex mt="30px">
          <Card my="5">
            <Text
              color={textColor}
              fontSize="lg"
              fontWeight="bold"
              textAlign="center"
            ></Text>

            <SumfuelvolumeCard
              periode={selectedFilter}
              startDate={fromDate}
              endDate={toDate}
            />
          </Card>
        </Flex>
      </Flex>
    </PeriodFilterContextProvider>
  );
}
