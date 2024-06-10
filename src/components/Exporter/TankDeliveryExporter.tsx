import { Button, ButtonGroup } from "@chakra-ui/react";
import { TankDelivery } from "common/model";

import jsPDF from "jspdf";
import "jspdf-autotable";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";

type TankDeliveryExporterProps = {
  tankDelivery: TankDelivery[];
};

const TankDeliveryExporter = ({ tankDelivery }: TankDeliveryExporterProps) => {
  const { t } = useTranslation();

  const exportToExcelHandler = async () => {
    const data = tankDelivery.map(
      ({
        tank,
        productVolume,
        fuelGradeName,
        productHeight,
        waterHeight,
        temperature,
      }) => ({
        [t("common.tank")]: tank,
        [t("common.productVolume")]: productVolume,
        [t("common.fuelGrades")]: fuelGradeName,
        [t("common.productHeight")]: productHeight,
        [t("common.waterHeight")]: waterHeight,
        [t("common.temperature")]: temperature,
      }),
    );

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Deliveries");
    XLSX.writeFile(wb, "deliveries.xlsx");
  };

  const exportToPDFHandler = () => {
    const doc = new jsPDF() as any;
    const tableColumn = [
      t("common.tank"),
      t("common.productVolume"),
      t("common.fuelGrades"),
      t("common.productHeight"),
      t("common.waterHeight"),
      t("common.temperature"),
    ];
    const tableRows: any[][] = [];

    tankDelivery.forEach((tankDeliverys) => {
      const rowData = [
        tankDeliverys.tank,
        tankDeliverys.productVolume,
        tankDeliverys.fuelGradeName,
        tankDeliverys.productHeight,
        tankDeliverys.waterHeight,
        tankDeliverys.temperature,
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
      (doc.getStringUnitWidth(t("routes.tankDelivery")) *
        doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    const xOffset = (pageWidth - titleWidth) / 2;

    // Center align the title
    doc.text(t("routes.tankDelivery"), xOffset, 10);

    const title = t("routes.tankDelivery");

    doc.save(`${title}.pdf`);
  };

  return (
    <ButtonGroup size="sm" spacing={4}>
      <Button onClick={exportToExcelHandler}>{t("common.exportExcel")}</Button>
      <Button onClick={exportToPDFHandler}>{t("common.exportPDF")}</Button>
    </ButtonGroup>
  );
};

export default TankDeliveryExporter;
