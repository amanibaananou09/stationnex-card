import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Link as ChakraLink,
  Text,
} from "@chakra-ui/react";
import { login } from "common/api/auth-api";
import LanguageSelector from "components/LanguageSelector";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { useAuth } from "store/AuthContext";
import { decodeToken } from "utils/utils";
import Logo from "../../assets/img/Stationnex.png";

type SignInFormValues = {
  username: string;
  password: string;
};

const SignIn = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const { signIn } = useAuth();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm({
    mode: "all",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const submitHandler: SubmitHandler<SignInFormValues> = async (values) => {
    const { username, password } = values;

    try {
      const { access_token, customer_id, supplier_id } = await login(
        username,
        password,
      );

      if (customer_id === null) {
        setErrorMessage(t("signIn.messageInvalidCustomer"));
        return;
      }

      const user = decodeToken(access_token);

      signIn(user!!, customer_id, supplier_id);
    } catch (error) {
      console.error(error);
      setErrorMessage(t("signIn.messageInvalid"));
    }
  };

  const handleForgotPasswordClick = () => {
    history.push("/auth/Forgot-Password");
  };

  return (
    <Flex
      direction="column"
      alignSelf="center"
      justifySelf="center"
      overflow="hidden"
    >
      <Flex position="absolute" top="30px" right="100px" zIndex="10">
        <LanguageSelector />
      </Flex>
      <Flex position="absolute" top="30px" left="150px" zIndex="100">
        <Text
          fontSize="2xl"
          fontWeight="sans-serif"
          color="gray.600"
          textAlign="center"
        >
          {t("signIn.platform")}
        </Text>
      </Flex>
      <Flex
        direction="column"
        textAlign="center"
        justifyContent="center"
        align="center"
        mt="80px"
        mb="30px"
      >
        <img
          src={Logo}
          alt="Stationnex Logo"
          style={{ height: "150px", width: "15%" }}
        />
        <Text
          fontSize="lg"
          color="black"
          fontWeight="bold"
          mt="10px"
          w={{ base: "90%", sm: "60%", lg: "40%", xl: "333px" }}
        ></Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px">
        <Flex
          direction="column"
          w="445px"
          background="transparent"
          borderRadius="15px"
          p="40px"
          mx={{ base: "100px" }}
          bg="white"
          boxShadow="0px 5px 14px rgba(0, 0, 0, 0.05)"
        >
          <Text
            fontSize="xl"
            color="gray.700"
            fontWeight="bold"
            textAlign="center"
            mb="22px"
          >
            {t("signIn.text")}
          </Text>
          <form>
            <FormControl isInvalid={!!form.formState.errors.username} mb="24px">
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                {t("signIn.useName")}
              </FormLabel>
              <Input
                id="username"
                fontSize="sm"
                ms="4px"
                type="text"
                placeholder={t("signIn.placeholderUsername")}
                size="lg"
                {...form.register("username", {
                  required: t("validation.username.required"),
                })}
              />
              <FormErrorMessage>
                {form.formState.errors.username?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!form.formState.errors.password} mb="24px">
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                {t("signIn.password")}
              </FormLabel>
              <InputGroup>
                <Input
                  id="password"
                  fontSize="sm"
                  ms="4px"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("signIn.placeholderPassword")}
                  size="lg"
                  {...form.register("password", {
                    required: t("validation.password.required"),
                  })}
                />
                <InputRightElement width="3.2rem">
                  <Button
                    h="115%"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    color="gray.500"
                    marginTop="15%"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {form.formState.errors.password?.message}
              </FormErrorMessage>
            </FormControl>
            <ChakraLink
              color="blue.400"
              fontSize="sm"
              onClick={handleForgotPasswordClick}
            >
              {t("signIn.forgotPassword")}
            </ChakraLink>
            <Flex py={5}>
              <Button
                fontSize="10px"
                variant="dark"
                fontWeight="bold"
                w="100%"
                h="45"
                mb="24px"
                onClick={form.handleSubmit(submitHandler)}
                isLoading={form.formState.isSubmitting}
              >
                {t("signIn.login")}
              </Button>
            </Flex>

            {errorMessage && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </form>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SignIn;
