import { Button, ButtonGroup } from "@chakra-ui/react";
import { PumpAttendant } from "common/model";

import jsPDF from "jspdf";
import "jspdf-autotable";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";

type PumpAttendantExporterProps = {
  pumpAttendants: PumpAttendant[];
};

const PumpAttendantExporter = ({
  pumpAttendants,
}: PumpAttendantExporterProps) => {
  const { t } = useTranslation();

  const exportToExcelHandler = () => {
    const data = pumpAttendants.map(
      ({ id, matricule, firstName, lastName, tag, actif, address, phone }) => ({
        ID: id || "",
        [t("attendant.matricule")]: matricule,
        [t("attendant.firstName")]: firstName,
        [t("attendant.lastName")]: lastName,
        [t("attendant.tag")]: tag,
        [t("attendant.status")]: actif
          ? t("attendant.active")
          : t("attendant.inactive"),
        [t("attendant.address")]: address,
        [t("attendant.phone")]: phone,
      }),
    );

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, t("routes.attendant"));
    XLSX.writeFile(workbook, "pump_attendants.xlsx");
  };

  const exportToPDFHandler = () => {
    const doc = new jsPDF() as any;
    const tableColumn = [
      "ID",
      t("attendant.matricule"),
      t("attendant.firstName"),
      t("attendant.lastName"),
      t("attendant.tag"),
      t("attendant.status"),
      t("attendant.address"),
      t("attendant.phone"),
    ];
    const tableRows: any[][] = [];

    pumpAttendants.forEach((pumpAttendant) => {
      const rowData = [
        pumpAttendant.id || "", // Assuming id is optional in PumpAttendant
        pumpAttendant.matricule,
        pumpAttendant.firstName,
        pumpAttendant.lastName,
        pumpAttendant.tag,
        pumpAttendant.actif ? t("attendant.active") : t("attendant.inactive"),
        pumpAttendant.address,
        pumpAttendant.phone,
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
      (doc.getStringUnitWidth(t("routes.attendant")) *
        doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    const xOffset = (pageWidth - titleWidth) / 2;

    // Center align the title
    doc.text(t("routes.attendant"), xOffset, 10);

    const title = t("routes.attendant");

    doc.save(`${title}.pdf`);
  };

  return (
    <ButtonGroup size="sm" spacing={4}>
      <Button onClick={exportToExcelHandler}>{t("common.exportExcel")}</Button>
      <Button onClick={exportToPDFHandler}>{t("common.exportPDF")}</Button>
    </ButtonGroup>
  );
};

export default PumpAttendantExporter;
