import { Button, ButtonGroup } from "@chakra-ui/react";

import jsPDF from "jspdf";
import "jspdf-autotable";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { formatDate, formatNumber } from "../../utils/utils";
import { Transaction } from "../../common/model";

type TransactionExporterProps = {
  transactions: Transaction[];
  isLoading: boolean;
};

const TransactionsExporter = ({
  transactions,
  isLoading,
}: TransactionExporterProps) => {
  const { t } = useTranslation();

  const exportToExcelHandler = () => {
    const data = transactions.map(
      ({
        cardIdentifier,
        dateTime,
        productName,
        price,
        quantity,
        amount,
        availableBalance,
        salePointName,
        city,
      }) => ({
        [t("transactions.cardId")]: cardIdentifier,
        [t("transactions.period")]: dateTime,
        [t("transactions.product")]: productName,
        [t("transactions.price")]: price,
        [t("transactions.volume")]: quantity,
        [t("transactions.amount")]: amount,
        [t("transactions.volumeRemaining")]: availableBalance,
        [t("transactions.station")]: salePointName,
        [t("transactions.city")]: city,
      }),
    );

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "transactions.xlsx");
  };

  const exportToPDFHandler = () => {
    const doc = new jsPDF() as any;
    const tableColumn = [
      "Index",
      t("transactions.cardId"),
      t("transactions.period"),
      t("transactions.product"),
      t("transactions.price"),
      t("transactions.volume"),
      t("transactions.amount"),
      t("transactions.volumeRemaining"),
      t("transactions.station"),
      t("transactions.city"),
    ];
    const tableRows: any[][] = [];

    transactions.forEach((transaction, index) => {
      const rowData = [
        index + 1,
        transaction.cardIdentifier,
        formatDate(transaction.dateTime),
        transaction.productName,
        transaction.price,
        formatNumber(transaction.quantity),
        transaction.amount,
        transaction.availableBalance,
        transaction.salePointName,
        transaction.city,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 5 },
    });
    const title = t("routes.transactions");

    let isFirstPage = true;
    const onPageAdded = (data: any) => {
      if (isFirstPage) {
        const pageWidth = doc.internal.pageSize.getWidth();
        const titleWidth =
          (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const xOffset = (pageWidth - titleWidth) / 2;

        doc.setFontSize(16);
        doc.text(title, xOffset, 10);

        doc.line(10, 15, pageWidth - 10, 15);

        isFirstPage = false;
      }
    };

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 5 },
      addPageContent: onPageAdded,
    });

    doc.save(`${title}.pdf`);
  };
  return (
    <ButtonGroup size="sm" spacing={4}>
      <Button onClick={exportToExcelHandler}>{t("common.exportExcel")}</Button>
      <Button onClick={exportToPDFHandler}>{t("common.exportPDF")}</Button>
    </ButtonGroup>
  );
};

export default TransactionsExporter;
