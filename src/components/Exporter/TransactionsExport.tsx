import { Button, ButtonGroup } from "@chakra-ui/react";

import jsPDF from "jspdf";
import "jspdf-autotable";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { formatDate, formatNumber } from "../../utils/utils";
import { Transaction } from "../../common/model";

type TransactionExporterProps = {
  transactions: Transaction[];
};

const TransactionsExporter = ({ transactions }: TransactionExporterProps) => {
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

    transactions.forEach((transaction) => {
      const rowData = [
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

    // Calculate the center of the page
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth =
      (doc.getStringUnitWidth(t("routes.transactions")) *
        doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    const xOffset = (pageWidth - titleWidth) / 2;

    // Center align the title
    doc.text(t("routes.transactions"), xOffset, 10);

    const title = t("routes.transactions");

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
