import "jspdf-autotable";

import { Button, Card, Divider, Flex, Text } from "@chakra-ui/react";
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
import TransactionFilter from "../../components/Filter/TransactionFilter";
import { TableSkeleton } from "../../components/Skeleton/Skeletons";

const Transactions = () => {
  const { t } = useTranslation();

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
    <Flex direction="column">
      <Card pb="0px">
        <ColumnSelectionDropdown
          columns={columns}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          setDisplayedColumns={setDisplayedColumns}
          isOpen={isOpen}
        />
        <Flex direction="row" p="20px" justifyContent="space-between">
          <Flex flexDirection="column">
            <Text fontSize="2xl" fontWeight="bold" mt={20}>
              {t("transactions.header")}
            </Text>
            <Text fontSize="l" fontWeight="normal">
              {t("transactions.text")}
            </Text>
          </Flex>
          {transactions && <TransactionsExporter transactions={transactions} />}
        </Flex>
        <CardBody>
          <Flex direction="row" p="20px" justifyContent="space-between">
            <TransactionFilter
              onChange={(filter) =>
                setCreteria((prev) => ({
                  ...prev,
                  ...filter,
                }))
              }
            />
          </Flex>

          <Divider />
          <Flex overflowX="auto">
            {!isLoading && (
              <UITable
                columns={displayedColumns}
                data={transactions}
                emptyListMessage={t("transactions.noTransactions")}
              />
            )}

            {isLoading && <TableSkeleton />}
            <Button
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              bg="white"
              mr={50}
              mt={3}
            >
              <FaEllipsisV />
            </Button>
          </Flex>
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
