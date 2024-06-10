import { Button, ButtonGroup, Flex } from "@chakra-ui/react";
import { PumpAttendantTeam, Rotation } from "common/model";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";

type TeamExporterProps = {
  teams: PumpAttendantTeam[];
  rotations: Rotation[];
};

const TeamExporter = ({ teams, rotations }: TeamExporterProps) => {
  const { t } = useTranslation();

  const getRotationName = (rotationId: number) => {
    const rotation = rotations.find((r) => r.id === rotationId);
    return rotation ? rotation.name : "";
  };

  const exportToExcelHandler = () => {
    const data = teams.flatMap(
      ({ id, teamName, pumpAttendantToPump, shiftRotationId }) => {
        const rotationName = getRotationName(shiftRotationId); // Get rotation name here
        const attendants = Object.values(pumpAttendantToPump).map(
          ({ firstName, lastName }) => ({
            [t("teams.fullName")]: `${firstName} ${lastName}`,
          }),
        );
        return attendants.map((attendant, index) => {
          if (index === 0) {
            return {
              [t("rotations.rotationName")]: rotationName,
              [t("teams.name")]: teamName,
              ...attendant,
              ID: id || "",
            };
          } else {
            return {
              [t("rotations.rotationName")]: "",
              [t("teams.name")]: "",
              ...attendant,
              ID: "",
            };
          }
        });
      },
    );

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, t("routes.attendanTeam"));

    const title = t("routes.attendanTeam");

    XLSX.writeFile(workbook, `${title}.xlsx`);
  };

  const exportToPDFHandler = () => {
    const doc = new jsPDF() as any;
    const tableColumn = [
      t("rotations.rotationName"),
      t("teams.name"),
      t("teams.fullName"),
      "ID",
    ];
    const tableRows: any[][] = [];

    teams.forEach(({ id, teamName, pumpAttendantToPump, shiftRotationId }) => {
      const rotationName = getRotationName(shiftRotationId);
      Object.values(pumpAttendantToPump).forEach(
        ({ firstName, lastName }, index) => {
          const fullName = `${firstName} ${lastName}`;
          const rowData = [
            index === 0 ? rotationName : "",
            index === 0 ? teamName : "",
            fullName,
            index === 0 ? id || "" : "",
          ];
          tableRows.push(rowData);
        },
      );
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
    });

    // Calculate the center of the page
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth =
      (doc.getStringUnitWidth(t("routes.attendanTeam")) *
        doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    const xOffset = (pageWidth - titleWidth) / 2;

    // Center align the title
    doc.text(t("routes.attendanTeam"), xOffset, 14);

    const title = t("routes.attendanTeam");

    doc.save(`${title}.pdf`);
  };

  return (
    <Flex>
      <ButtonGroup size="sm" spacing={4}>
        <Button onClick={exportToExcelHandler}>
          {t("common.exportExcel")}
        </Button>
        <Button onClick={exportToPDFHandler}>{t("common.exportPDF")}</Button>
      </ButtonGroup>
    </Flex>
  );
};

export default TeamExporter;
