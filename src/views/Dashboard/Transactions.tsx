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
import React, { useEffect, useState } from "react";
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
import TransactionFilter from "../../components/Filter/TransactionFilter";
import {
  formatDate,
  formatNumber,
  formatNumberByCountryCode,
} from "../../utils/utils";

const Transactions = () => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<string>("USD"); // Default country code

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
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      // Set the country code from the first transaction's sale point
      const firstTransactionCountryCode =
        transactions[0]?.salePoint?.country?.code || "USD";
      setCountryCode(firstTransactionCountryCode);
    }
  }, [transactions]);

  const { allTransactions, isLoading: isExportLoading } = useAllTransactions(
    creteria,
  );
  const columns: UIColumnDefinitionType<Transaction>[] = [
    {
      header: t("transactions.cardId"),
      key: "cardIdentifier",
    },
    {
      header: t("transactions.period"),
      key: "dateTime",
      render: (tr) => formatDate(tr.dateTime),
    },
    {
      header: t("transactions.product"),
      key: "productName",
    },
    {
      header: `${t("transactions.price")} (${formatNumberByCountryCode(
        0,
        countryCode,
        true,
        false,
      )})`,
      key: "price",
      render: (tr) => {
        const countryCode = tr.salePoint?.country?.code || "USD";
        return formatNumberByCountryCode(tr.price, countryCode, false, true);
      },
    },
    {
      header: t("transactions.volume"),
      key: "quantity",
      render: (tr) => formatNumber(tr.quantity),
    },
    {
      header: `${t("transactions.amount")} (${formatNumberByCountryCode(
        0,
        countryCode,
        true,
        false,
      )})`,
      key: "amount",
      render: (tr) => {
        const countryCode = tr.salePoint?.country?.code || "USD";
        return formatNumberByCountryCode(tr.amount, countryCode, false, true);
      },
    },
    {
      header: `${t(
        "transactions.remainingBalance",
      )} (${formatNumberByCountryCode(0, countryCode, true, false)})`,
      key: "availableBalance",
      render: (tr) =>
        tr.availableBalance === 0 || tr.availableBalance === null
          ? "-"
          : formatNumber(tr.availableBalance),
    },
    {
      header: t("transactions.volumeRemaining"),
      key: "availableVolume",
      render: (tr) =>
        tr.availableVolume === 0 || tr.availableVolume === null
          ? "-"
          : formatNumberByCountryCode(
              tr.availableVolume,
              tr.salePoint?.country?.code || "USD",
              false,
              true,
            ),
    },
    {
      header: `${t(
        "transactions.remainingBalancePerProduct",
      )} (${formatNumberByCountryCode(0, countryCode, true, false)})`,
      key: "remainingBalancePerProduct",
      render: (tr) => (
        <>
          {Object.entries(tr.remainingBalancePerProduct || {}).map(
            ([productName, remainingBalance]) => (
              <Box
                key={productName}
                width="300px"
                p="8px"
                bg="gray.300"
                boxShadow="sm"
              >
                {productName}:{" "}
                {remainingBalance === 0 || remainingBalance === null
                  ? "-"
                  : formatNumberByCountryCode(
                      remainingBalance,
                      tr.salePoint?.country?.code || "USD",
                      false,
                      true,
                    )}
              </Box>
            ),
          )}
        </>
      ),
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

  useEffect(() => {
    setDisplayedColumns(
      visibleColumns.length > 0
        ? columns.filter((col) => visibleColumns.includes(col.key as string))
        : columns,
    );
  }, [columns, visibleColumns]);
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
                        autoHide={false}
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
