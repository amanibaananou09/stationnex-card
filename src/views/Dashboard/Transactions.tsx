import "jspdf-autotable";

import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
  Flex,
  Text,
} from "@chakra-ui/react";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import ColumnSelectionDropdown from "components/ColumnSelector/ColumnSelector";
import { UIColumnDefinitionType } from "components/UI/Table/Types";
import UITable from "components/UI/Table/UITable";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEllipsisV } from "react-icons/fa";
import Pagination from "../../components/Pagination/Pagination";
import { Transaction, TransactionCreteria } from "../../common/model";
import { useTransaction } from "hooks/use-transaction";
import TransactionsExporter from "../../components/Exporter/TransactionsExport";
import { TableSkeleton } from "../../components/Skeleton/Skeletons";
import CardHeader from "../../components/Card/CardHeader";
import { Scrollbars } from "react-custom-scrollbars";
import useAllTransactions from "../../hooks/use-all-transaction";
import { useAuth } from "../../store/AuthContext";
import TransactionFilter from "../../components/Filter/TransactionFilter";

const Transactions = () => {
  const { t } = useTranslation();
  const { customerId } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [creteria, setCreteria] = useState<TransactionCreteria>({
    page: 0,
    size: 25,
    cardIds: [],
    salePointIds: [],
    productIds: [],
    period: { from: "", to: "" },
    city: [],
  });

  const { transactions, totalPages, totalElements, isLoading } = useTransaction(
    creteria,
  );
  const { allTransactions, isLoading: isExportLoading } = useAllTransactions(
    creteria,
  );
  const columns: UIColumnDefinitionType<Transaction>[] = [
    {
      header: "#",
      key: "#",
      render: (item, index) => <div>{index + 1}</div>,
    },
    {
      header: t("transactions.cardId"),
      key: "cardIdentifier",
    },
    {
      header: t("transactions.period"),
      key: "dateTime",
    },
    {
      header: t("transactions.product"),
      key: "productName",
    },
    {
      header: t("transactions.price"),
      key: "price",
    },
    {
      header: t("transactions.volume"),
      key: "quantity",
    },
    {
      header: t("transactions.amount"),
      key: "amount",
    },
    {
      header: t("transactions.volumeRemaining"),
      key: "availableBalance",
      render: (tr) => tr.availableBalance || "-",
    },
    {
      header: t("transactions.station"),
      key: "salePointName",
    },
    {
      header: t("transactions.city"),
      key: "city",
    },
  ];

  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [displayedColumns, setDisplayedColumns] = useState<
    UIColumnDefinitionType<Transaction>[]
  >(columns);

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card pb="0px">
        <CardHeader
          p="2px 0px 22px 0px"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex flexDirection="column">
            <Text fontSize="2xl" fontWeight="bold">
              {t("transactions.header")}
            </Text>
            <Text fontSize="l" fontWeight="normal">
              {t("transactions.text")}
            </Text>
          </Flex>
          {allTransactions && (
            <Flex justifyContent="flex-end">
              <TransactionsExporter
                transactions={allTransactions}
                isLoading={isExportLoading}
              />
            </Flex>
          )}
        </CardHeader>
        <ColumnSelectionDropdown
          columns={columns}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          setDisplayedColumns={setDisplayedColumns}
          isOpen={isOpen}
        />
        <CardBody>
          <Box p="20px">
            <TransactionFilter
              onChange={(filter) =>
                setCreteria((prev) => ({
                  ...prev,
                  ...filter,
                }))
              }
            />
          </Box>

          <Divider />
          <CardBody>
            <Box pb="0px">
              <Flex direction="row" margin="30px 0px">
                {isLoading ? (
                  <TableSkeleton />
                ) : (
                  <>
                    {!isLoading && transactions && transactions.length > 0 ? (
                      <Scrollbars
                        autoHide
                        style={{ height: "calc(100vh - 185px)" }}
                      >
                        <UITable
                          columns={displayedColumns}
                          data={transactions}
                          emptyListMessage={t("transactions.noTransactions")}
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
                            {t("transactions.noTransactions")}
                          </AlertTitle>
                        </Alert>
                      </Flex>
                    )}
                  </>
                )}
                {!isLoading && transactions && transactions.length > 0 && (
                  <Button onClick={() => setIsOpen(!isOpen)} bg="white" mr={1}>
                    <FaEllipsisV />
                  </Button>
                )}
              </Flex>
            </Box>
          </CardBody>
        </CardBody>

        {!isLoading && transactions && transactions.length > 0 && (
          <Pagination
            defaultPage={creteria.page}
            defaultsize={creteria.size}
            onChange={(page, size) =>
              setCreteria((prev) => ({
                ...prev,
                page,
                size,
              }))
            }
            totalPages={totalPages}
            totalElements={totalElements}
          />
        )}
      </Card>
    </Flex>
  );
};

export default Transactions;
