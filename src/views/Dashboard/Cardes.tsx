import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CardManagement from "./CardManagement";

const Cardes = () => {
  const { t } = useTranslation();

  const [tabIndex, setTabIndex] = useState(0);

  const titles = [t("cardManagement.header"), "Transactions"];

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card pb="0px">
        <CardHeader p="6px 0px 22px 0px" display="flex" flexDirection="column">
          <Text fontSize="xl" color="gray.700" fontWeight="bold">
            {t("cardManagement.header")}
          </Text>
          <Text fontSize="l" color="gray.500" fontWeight="normal">
            {t("cardManagement.subtitle")}
          </Text>
        </CardHeader>
        <CardBody>
          <Tabs onChange={(index) => setTabIndex(index)} isLazy>
            <TabList>
              <Tab
                _selected={{
                  fontWeight: "bold",
                  bg: "gray.100",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              >
                {t("card.header")}
              </Tab>
              <Tab
                _selected={{
                  fontWeight: "bold",
                  bg: "gray.100",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              >
                {t("cardManagement.topUp")}
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <CardManagement />
              </TabPanel>
              <TabPanel></TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </Flex>
  );
};

export default Cardes;
