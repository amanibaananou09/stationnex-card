import { Flex, Select, Text } from "@chakra-ui/react";
import { Rotation } from "common/model";
import React from "react";
import { useTranslation } from "react-i18next";

type RotationSectionProps = {
  shiftRotation: Rotation;
  rotations: Rotation[];
  onChange: (rotationId: number) => void;
};

const RotationSection = ({
  rotations,
  shiftRotation,
  onChange,
}: RotationSectionProps) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Flex alignItems="center" gap={2}>
        <Text flex={1} fontWeight="bold">
          {t("teams.rotationSection.name")} :
        </Text>
        <Select
          flex={2}
          value={shiftRotation?.id}
          onChange={(e) => onChange(+e.target.value)}
        >
          {rotations &&
            rotations.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
        </Select>
      </Flex>
      <Flex alignItems="center" gap={2}>
        <Text flex={1} fontWeight="bold">
          {t("teams.rotationSection.validity")} :
        </Text>
        <Text flex={2}>{`${t("teams.rotationSection.from")} ${
          shiftRotation?.startValidityDate
        } ${t("teams.rotationSection.to")} ${
          shiftRotation?.endValidityDate
        }`}</Text>
      </Flex>
      <Flex alignItems="center" gap={2}>
        <Text flex={1} fontWeight="bold">
          {t("teams.rotationSection.dayOff")} :
        </Text>
        <Text flex={2}>
          {`${shiftRotation?.nbrOffDays} ${t("teams.rotationSection.day")}`}
        </Text>
      </Flex>
      <Flex alignItems="center" gap={2}>
        <Text flex={1} fontWeight="bold">
          {t("teams.rotationSection.posts")} :
        </Text>
        <Text flex={2}>
          {`${shiftRotation?.shifts.length} ${t("teams.rotationSection.post")}`}
        </Text>
      </Flex>
    </React.Fragment>
  );
};

export default RotationSection;
