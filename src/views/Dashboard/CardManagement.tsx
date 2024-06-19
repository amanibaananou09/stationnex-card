import "jspdf-autotable";

import {
  Alert,
  Text,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Select,
  Input,
} from "@chakra-ui/react";
import { GeneralCard } from "common/model";
import CardBody from "components/Card/CardBody";
import ColumnSelectionDropdown from "components/ColumnSelector/ColumnSelector";
import { TableSkeleton } from "components/Skeleton/Skeletons";
import { UIColumnDefinitionType } from "components/UI/Table/Types";
import UITable from "components/UI/Table/UITable";
import { useCard, useCardQueries } from "hooks/use-card";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEllipsisV, FaPencilAlt } from "react-icons/fa";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import UISwitch from "../../components/UI/Form/UISwitch";
import { Scrollbars } from "react-custom-scrollbars";
import CardsExporter from "../../components/Exporter/CardsExporter";

const CardManagement = () => {
  const { customerId } = useAuth();
  const { t } = useTranslation();
  const [searchType, setSearchType] = useState<string>("cardId");
  const [searchText, setSearchText] = useState<string>("");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { cards, isLoading } = useCard(customerId);
  const { activate, desactivate } = useCardQueries();

  const history = useHistory();
  let { path } = useRouteMatch();

  const submitModalHandler = async () => {};

  const updateStatus = async (card: GeneralCard) => {
    if (card.actif && card.id) {
      // If currently active, deactivate
      desactivate(card.id);
    } else if (card.id) {
      // If currently inactive, activate
      activate(card.id);
    }
  };

  const formatExpirationDate = (date: Date) => {
    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    return `${day} ${monthNames[monthIndex]} ${year}`;
  };

  const columns: UIColumnDefinitionType<GeneralCard>[] = [
    {
      header: "#",
      key: "#",
      render: (item, index) => <div>{index + 1}</div>,
    },
    {
      header: t("card.cardId"),
      key: "cardId",
    },
    {
      header: t("card.holder"),
      key: "holder",
    },
    {
      header: t("card.cardGroup"),
      key: "cardGroupName",
    },
    {
      header: t("card.expirationDate"),
      key: "expirationDate",
      render: (card) => formatExpirationDate(new Date(card.expirationDate)),
    },
    {
      header: t("cardManagement.status"),
      key: "actif",
      render: (card: GeneralCard) => (
        <UISwitch checked={card.actif} onChange={() => updateStatus(card)} />
      ),
    },
  ];

  //styles
  const textColor = "gray.700";
  const [invisibleColumns, setInvisibleColumns] = useState<string[]>([]);
  const [showColumns, setShowColumns] =
    useState<UIColumnDefinitionType<GeneralCard>[]>(columns);
  //search
  const handleSearchTypeChange = (value: string) => {
    setSearchType(value);
    // Clear search text if the filter type changes
    setSearchText("");
  };

  const handleSearch = async (): Promise<void> => {
    let search = "";
    if (searchType && searchText) {
      search = `${searchType}=${searchText}`;
    }

    history.replace({
      pathname: path,
      search,
    });
  };

  useEffect(() => {
    if (isOpen) {
      handleSearch();
    }
  }, [isOpen]);

  return (
    <>
      <ColumnSelectionDropdown
        columns={columns}
        visibleColumns={invisibleColumns}
        setVisibleColumns={setInvisibleColumns}
        setDisplayedColumns={setShowColumns}
        isOpen={isOpen}
      />
      <CardBody>
        <Flex justifyContent="space-between">
          <Flex
            flexDirection="row"
            justifyContent="flex-start"
            gap="3"
            m="10px"
          >
            <Flex flexDirection="row" gap="5">
              <Flex flexDirection="column" width="50%">
                <Text>{t("cardSearch.filterType.label")}:</Text>
                <Select
                  isDisabled={!customerId}
                  placeholder=""
                  value={searchType}
                  onChange={(e) => handleSearchTypeChange(e.target.value)}
                >
                  <option value="cardId">{t("cardSearch.cardId")}</option>
                  <option value="holder">{t("cardSearch.holder")}</option>
                  <option value="actif">{t("cardSearch.status")}</option>
                  <option value="expirationDate">
                    {t("cardSearch.expirationDate")}
                  </option>
                </Select>
              </Flex>
              {searchType === "actif" && (
                <Flex flexDirection="column" width="50%">
                  <Text>{t("cardSearch.filterTextLabel")}:</Text>
                  <Select
                    isDisabled={!customerId}
                    placeholder=""
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  >
                    <option value="true">{t("cardManagement.active")}</option>
                    <option value="false">
                      {t("cardManagement.inactive")}
                    </option>
                  </Select>
                </Flex>
              )}
              {searchType === "expirationDate" && (
                <Flex flexDirection="column" width="50%">
                  <Text>{t("cardSearch.filterTextLabel")}:</Text>
                  <Input
                    isDisabled={!customerId}
                    type="month"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </Flex>
              )}

              {searchType !== "actif" && searchType !== "expirationDate" && (
                <Flex flexDirection="column" width="50%">
                  <Text>{t("cardSearch.filterTextLabel")}:</Text>
                  <Input
                    isDisabled={!customerId}
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </Flex>
              )}
            </Flex>

            <Button
              size="md"
              mt="5"
              color="white"
              bg="blue.500"
              isDisabled={!customerId}
              _hover={{ bg: "blue.500" }}
              onClick={handleSearch}
            >
              {t("cardSearch.search")}
            </Button>
          </Flex>
          {cards && <CardsExporter cards={cards} />}
        </Flex>

        <Box pb="0px">
          <Flex direction="row" margin="30px 0px">
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <>
                {!isLoading && cards && cards.length > 0 ? (
                  <Scrollbars
                    autoHide
                    style={{ height: "calc(100vh - 185px)" }}
                  >
                    <UITable
                      columns={showColumns}
                      data={cards}
                      emptyListMessage={t("cardManagement.isLoading")}
                    />
                  </Scrollbars>
                ) : (
                  <Flex
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                  >
                    <Alert
                      status="info"
                      variant="subtle"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      textAlign="center"
                      mt="0px"
                      maxWidth="400px"
                    >
                      <AlertIcon />
                      <AlertTitle mt={4} mb={1} fontSize="lg">
                        {t("cardManagement.isLoading")}
                      </AlertTitle>
                    </Alert>
                  </Flex>
                )}
              </>
            )}
            {!isLoading && cards && cards.length > 0 && (
              <Button onClick={() => setIsOpen(!isOpen)} bg="white" mr={1}>
                <FaEllipsisV />
              </Button>
            )}
          </Flex>
        </Box>
      </CardBody>
    </>
  );
};
export default CardManagement;
