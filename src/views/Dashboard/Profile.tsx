import { Avatar, Box, Flex, Grid, Text, Stack, Center } from "@chakra-ui/react";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "store/AuthContext";
import { FaPencilAlt, FaCheck } from "react-icons/fa";
import { useUserByName, useUserQueries } from "../../hooks/use-user";
import { GeneralUser } from "common/model";

const Profile = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { update } = useUserQueries();
  const { profile, refetch } = useUserByName(user?.username);

  const [editedPhone, setEditedPhone] = useState(profile?.phone || "");
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const [editedEmail, setEditedEmail] = useState(profile?.email || "");
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  useEffect(() => {
    setEditedPhone(profile?.phone || "");
    setEditedEmail(profile?.email || "");
  }, [profile]);

  const handleUpdatePhone = async () => {
    const updatedUserData: GeneralUser = {
      username: user?.username || "",
      customerAccountId: user?.customerAccountId || "",
      phone: editedPhone,
      email: editedEmail,
    };
    await update(updatedUserData);
    setIsEditingPhone(false);
    setIsEditingEmail(false);
    refetch();
  };

  const handleEditPhone = () => {
    setIsEditingPhone(true);
    setEditedPhone(profile?.phone || "");
  };
  const handleEditEmail = () => {
    setIsEditingEmail(true);
    setEditedEmail(profile?.email || "");
  };

  const handleSavePhone = async () => {
    if (editedPhone !== profile?.phone) {
      await handleUpdatePhone();
    }
  };
  const handleSaveEmail = async () => {
    if (editedEmail !== profile?.email) {
      await handleUpdatePhone();
    }
  };

  // Styles
  const textColor = "gray.700";
  const cardColor = "blue.100";

  return (
    <Center pt={{ base: "120px", md: "75px", lg: "100px" }} mt={100}>
      <Flex
        direction="column"
        align="center"
        justifyContent="center"
        p="24px"
        borderRadius="20px"
        boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
        border="1.5px solid"
        borderColor="gray.200"
        bg="gray.200"
        width={{ base: "80%", md: "70%", lg: "60%" }}
      >
        <Avatar size="xl" name={user?.name || ""} />
        <Card bg={cardColor} mt="6">
          <Stack mt="4" spacing="3" align="center">
            <Flex align="center" justify="center">
              <Text fontSize="xl" fontWeight="bold" color={textColor} mr="2">
                {user?.name || ""}
              </Text>
            </Flex>
            <Flex align="center" justify="center">
              {isEditingEmail ? (
                <Flex align="center">
                  <input
                    type="text"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                  />
                </Flex>
              ) : (
                <Text fontSize="md" color="gray.500" p="2">
                  {editedEmail}
                </Text>
              )}
              <Box ml="auto" p={2}>
                {!isEditingEmail ? (
                  <FaPencilAlt
                    style={{ cursor: "pointer" }}
                    onClick={handleEditEmail}
                  />
                ) : (
                  <FaCheck
                    style={{ cursor: "pointer" }}
                    onClick={handleSaveEmail}
                  />
                )}
              </Box>
            </Flex>
          </Stack>
        </Card>
        <Grid mt="6" templateColumns="1fr 1fr" gap="4" w="100%">
          <Card bg={cardColor}>
            <CardHeader>
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                {t("profile.name")}
              </Text>
            </CardHeader>
            <CardBody>
              <Text fontSize="md" color="gray.500">
                {user?.username || ""}
              </Text>
            </CardBody>
          </Card>
          <Card bg={cardColor}>
            <CardHeader>
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                {t("profile.phone")}
              </Text>
            </CardHeader>
            <CardBody>
              <Flex align="center" justify="center">
                {isEditingPhone ? (
                  <Flex align="center">
                    <input
                      type="text"
                      value={editedPhone}
                      onChange={(e) => setEditedPhone(e.target.value)}
                    />
                  </Flex>
                ) : (
                  <Text fontSize="md" color="gray.500" p="2">
                    {editedPhone}
                  </Text>
                )}
                <Box ml="auto" p={2}>
                  {!isEditingPhone ? (
                    <FaPencilAlt
                      style={{ cursor: "pointer" }}
                      onClick={handleEditPhone}
                    />
                  ) : (
                    <FaCheck
                      style={{ cursor: "pointer" }}
                      onClick={handleSavePhone}
                    />
                  )}
                </Box>
              </Flex>
            </CardBody>
          </Card>
        </Grid>
      </Flex>
    </Center>
  );
};

export default Profile;
