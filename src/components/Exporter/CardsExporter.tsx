import { Button, ButtonGroup } from "@chakra-ui/react";

import jsPDF from "jspdf";
import "jspdf-autotable";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { GeneralCard } from "common/model";

type CardExporterProps = {
  cards: GeneralCard[];
};

const CardsExporter = ({ cards }: CardExporterProps) => {
  const { t } = useTranslation();

  const exportToExcelHandler = () => {
    const data = cards.map(
      ({ cardId, holder, cardGroupName, expirationDate }) => ({
        [t("card.cardId")]: cardId,
        [t("card.holder")]: holder,
        [t("card.cardGroup")]: cardGroupName,
        [t("card.expirationDate")]: expirationDate,
      }),
    );

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cards");
    XLSX.writeFile(wb, "cards.xlsx");
  };

  const exportToPDFHandler = () => {
    const doc = new jsPDF() as any;
    const tableColumn = [
      t("card.cardId"),
      t("card.holder"),
      t("card.cardGroup"),
      t("card.expirationDate"),
    ];
    const tableRows: any[][] = [];

    cards.forEach((card) => {
      const rowData = [
        card.cardId,
        card.holder,
        card.cardGroupName,
        card.expirationDate,
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
      (doc.getStringUnitWidth(t("routes.cardManagement")) *
        doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    const xOffset = (pageWidth - titleWidth) / 2;

    // Center align the title
    doc.text(t("routes.cardManagement"), xOffset, 10);

    const title = t("routes.cardManagement");

    doc.save(`${title}.pdf`);
  };

  return (
    <ButtonGroup size="sm" spacing={4}>
      <Button onClick={exportToExcelHandler}>{t("common.exportExcel")}</Button>
      <Button onClick={exportToPDFHandler}>{t("common.exportPDF")}</Button>
    </ButtonGroup>
  );
};

export default CardsExporter;
