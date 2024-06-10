import {
  Box,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  HStack,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Moment } from "moment";
import { useTranslation } from "react-i18next";

const SkeletonInputLabel = ({ label }: { label: string }) => (
  <Flex alignItems="center" w="100%">
    <Text flex={1} ms="4px" fontSize="sm" fontWeight="bold">
      {label}
    </Text>
    <Skeleton flex={2} my="1px" height="50px" borderRadius="10px" />
  </Flex>
);

const SkeletonInput = () => (
  <Skeleton w="100%" my="1px" height="50px" borderRadius="10px" />
);

export const PumpAttendantFormSkeleton = () => {
  const { t } = useTranslation();

  return (
    <form>
      <SimpleGrid columns={1} spacing={5}>
        <SkeletonInputLabel label={t("attendant.firstName")} />
        <SkeletonInputLabel label={t("attendant.lastName")} />
        <SkeletonInputLabel label={t("attendant.tag")} />
        <SkeletonInputLabel label={t("attendant.matricule")} />
        <SkeletonInputLabel label={t("attendant.address")} />
        <SkeletonInputLabel label={t("attendant.phone")} />
      </SimpleGrid>
    </form>
  );
};

export const FuelGradeFormSkeleton = () => {
  const { t } = useTranslation();

  return (
    <form>
      <SimpleGrid columns={1} spacing={5}>
        <SkeletonInputLabel label={t("fuelGrades.fuelName")} />
        <SkeletonInputLabel label={t("fuelGrades.oldPrice")} />
        <SkeletonInputLabel label={t("fuelGrades.newPrice")} />
        <SkeletonInputLabel label={t("fuelGrades.date")} />
      </SimpleGrid>
    </form>
  );
};

export const RotationFormSkeleton = () => {
  const { t } = useTranslation();
  return (
    <form>
      <SkeletonInputLabel label={t("rotations.rotation")} />

      <SimpleGrid columns={2} spacing={4} mt={4}>
        <SkeletonInputLabel label={t("rotationModal.labelDateStart") + " :"} />
        <SkeletonInputLabel label={t("rotationModal.labelau") + " :"} />
      </SimpleGrid>
      <SimpleGrid
        columns={1}
        mt={4}
        width="100%"
        borderWidth="1px"
        borderRadius="md"
      >
        <Box
          as="div"
          gridColumn="span 4"
          display="flex"
          justifyContent="space-between"
          fontWeight="bold"
        >
          <Box as="div" fontWeight="bold" p={2}>
            {t("rotations.post")}
          </Box>
          <Box as="div" fontWeight="bold" p={2} marginLeft="30%">
            {t("rotationModal.startTime")}
          </Box>
          <Box as="div" fontWeight="bold" p={2} marginLeft="1%">
            {t("rotationModal.endingTime")}
          </Box>
        </Box>
        <Flex flexDirection="column" m="10px" gap={2}>
          <SkeletonInput />
          <SkeletonInput />
        </Flex>
      </SimpleGrid>
    </form>
  );
};

export const TeamFormSkeleton = () => {
  const { t } = useTranslation();
  return (
    <form>
      <Grid templateColumns="repeat(1, 1fr)" gap={5}>
        <GridItem colSpan={1} alignItems="center">
          <SkeletonInputLabel label={t("teams.name")} />
          <SkeletonInputLabel label={t("teams.rotation")} />
        </GridItem>
        <GridItem colSpan={1}>
          <Flex flexDirection="column" gap={2}>
            <SkeletonInput />
            <SkeletonInput />
            <SkeletonInput />
            <SkeletonInput />
            <SkeletonInput />
          </Flex>
        </GridItem>
      </Grid>
    </form>
  );
};

export const ShiftPlanningExecutionDetailSkeleton = ({
  isAutomaticMode,
}: {
  isAutomaticMode: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <form>
      <SimpleGrid columns={1} spacing={4} mt={4}>
        {!isAutomaticMode && (
          <>
            <SkeletonInputLabel label={t("common.pump")} />
            <SkeletonInputLabel label={t("common.fuelGrades")} />
            <HStack spacing={100}>
              <Checkbox>{t("common.ComplementPost")}</Checkbox>
            </HStack>
          </>
        )}

        <SkeletonInputLabel label={t("dailyAgenda.pumpAttendants")} />

        <SkeletonInputLabel label={t("common.startTime")} />

        <SkeletonInputLabel label={t("common.endTime")} />

        {!isAutomaticMode && (
          <SkeletonInputLabel label={t("common.TankReturn")} />
        )}
      </SimpleGrid>
    </form>
  );
};

export const MonthlyPlanningSkeleton = ({
  currentMonth,
}: {
  currentMonth: Moment;
}) => {
  return (
    <Grid templateColumns="repeat(7, 1fr)" gap={2}>
      {Array.apply(
        null,
        Array(currentMonth ? currentMonth.daysInMonth() : 31),
      ).map((_, index) => (
        <Skeleton key={index} height="150px" borderRadius="10px" />
      ))}
    </Grid>
  );
};

export const TableSkeleton = () => {
  return (
    <Stack width="100%" margin="20px 0px">
      <Skeleton height="50px" borderRadius="10px" />
      <Skeleton height="50px" borderRadius="10px" />
      <Skeleton height="50px" borderRadius="10px" />
      <Skeleton height="50px" borderRadius="10px" />
      <Skeleton height="50px" borderRadius="10px" />
      <Skeleton height="50px" borderRadius="10px" />
      <Skeleton height="50px" borderRadius="10px" />
      <Skeleton height="50px" borderRadius="10px" />
      <Skeleton height="50px" borderRadius="10px" />
    </Stack>
  );
};
