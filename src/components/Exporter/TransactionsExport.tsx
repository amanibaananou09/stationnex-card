import { Button, ButtonGroup } from "@chakra-ui/react";
import { Transaction } from "common/model";

import jsPDF from "jspdf";
import "jspdf-autotable";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { formatDate, formatNumber } from "../../utils/utils";

type TransactionExporterProps = {
  transactions: Transaction[];
};

const TransactionsExporter = ({ transactions }: TransactionExporterProps) => {
  const { t } = useTranslation();

  const exportToExcelHandler = () => {
    const data = transactions.map(
      ({
        pumpAttendantName,
        tag,
        pump,
        fuelGradeName,
        price,
        volume,
        totalVolume,
        amount,
        totalAmount,
        dateTimeStart,
      }) => ({
        [t("routes.attendant")]: pumpAttendantName,
        [t("transactions.tag")]: tag,
        [t("common.pump")]: pump,
        [t("common.fuelGrades")]: fuelGradeName,
        [t("transactions.price")]: price,
        [t("common.volume")]: volume,
        [t("transactions.totalVolume")]: totalVolume,
        [t("common.amount")]: amount,
        [t("transactions.totalAmount")]: totalAmount,
        [t("common.dateTimeStart")]: dateTimeStart,
      }),
    );

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "all_transactions.xlsx");
  };

  const exportToPDFHandler = () => {
    const doc = new jsPDF() as any;
    const tableColumn = [
      t("routes.attendant"),
      t("transactions.tag"),
      t("common.pump"),
      t("common.fuelGrades"),
      t("transactions.price"),
      t("common.volume"),
      t("transactions.totalVolume"),
      t("common.amount"),
      t("transactions.totalAmount"),
      t("common.dateTimeStart"),
    ];
    const tableRows: any[][] = [];

    transactions.forEach((transaction) => {
      const rowData = [
        transaction.pumpAttendantName,
        transaction.tag,
        transaction.pump,
        transaction.fuelGradeName,
        transaction.price,
        formatNumber(transaction.volume),
        formatNumber(transaction.totalVolume),
        transaction.amount,
        transaction.totalAmount,
        formatDate(transaction.dateTimeStart),
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
