import { Button, ButtonGroup } from "@chakra-ui/react";
import { Rotation } from "common/model";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";

type RotationExporterProps = {
  rotations: Rotation[];
};

const RotationExporter = ({ rotations }: RotationExporterProps) => {
  const { t } = useTranslation();

  const exportToExcelHandler = () => {
    const data = rotations.flatMap(
      ({
        name,
        startValidityDate,
        endValidityDate,
        nbrOffDays,
        shifts,
        id,
      }) => {
        const rotationRow = {
          [t("rotations.rotationName")]: name,
          [t("rotations.rotationStartValidityDate")]: startValidityDate,
          [t("rotations.rotationEndValidityDate")]: endValidityDate,
          [t("rotations.nbrOffDays")]: nbrOffDays,
          ID: id || "",
        };
        const shiftRows = shifts.map(
          ({ id: shiftId, name: shiftName, startingTime, endingTime }) => ({
            [t("rotations.shiftID")]: shiftId || "",
            [t("rotations.shiftName")]: shiftName,
            [t("rotations.startingTime")]: startingTime,
            [t("rotations.endingTime")]: endingTime,
          }),
        );
        return [rotationRow, ...shiftRows];
      },
    );

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, t("routes.rotations"));
    XLSX.writeFile(workbook, "rotations.xlsx");
  };

  const exportToPDFHandler = () => {
    const doc = new jsPDF() as any;
    const tableColumn = [
      t("rotations.rotationName"),
      t("rotations.rotationStartValidityDate"),
      t("rotations.rotationEndValidityDate"),
      t("rotations.nbrOffDays"),
      t("rotations.shiftID"),
      t("rotations.shiftName"),
      t("rotations.startingTime"),
      t("rotations.endingTime"),
      "ID",
    ];
    const tableRows: any[][] = [];

    rotations.forEach(
      ({
        name,
        startValidityDate,
        endValidityDate,
        nbrOffDays,
        shifts,
        id,
      }) => {
        const rotationRow = [
          name,
          startValidityDate,
          endValidityDate,
          nbrOffDays,
          "",
          "",
          "",
          "",
          id || "",
        ];
        tableRows.push(rotationRow);
        shifts.forEach(
          ({ id: shiftId, name: shiftName, startingTime, endingTime }) => {
            const shiftRow = [
              "",
              "",
              "",
              "",
              shiftId || "",
              shiftName,
              startingTime,
              endingTime,
              "",
            ];
            tableRows.push(shiftRow);
          },
        );
      },
    );

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
    });

    // Calculate the center of the page
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth =
      (doc.getStringUnitWidth(t("routes.attendant")) *
        doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    const xOffset = (pageWidth - titleWidth) / 2;

    // Center align the title
    doc.text(t("routes.rotations"), xOffset, 10);

    const title = t("routes.rotations");

    doc.save(`${title}.pdf`);
  };

  return (
    <ButtonGroup size="sm" spacing={4}>
      <Button onClick={exportToExcelHandler}>{t("common.exportExcel")}</Button>
      <Button onClick={exportToPDFHandler}>{t("common.exportPDF")}</Button>
    </ButtonGroup>
  );
};

export default RotationExporter;
