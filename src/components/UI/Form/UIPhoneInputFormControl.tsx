import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import { PhoneInput } from "components/Input/PhoneInput";
import { UseControllerProps, useController } from "react-hook-form";

type UIPhoneInputFormControlProps = UseControllerProps<any> & {
  label?: string;
};

const UIPhoneInputFormControl = ({
  name,
  label,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  disabled,
}: UIPhoneInputFormControlProps) => {
  const { field, fieldState } = useController({
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,
  });

  const fieldName = field.name;
  const invalid = !!fieldState.error;
  const val = field.value ?? "";
  const changeHandler = field.onChange;
  const blurHandler = field.onBlur;
  const error = fieldState.error?.message;

  return (
    <FormControl isInvalid={invalid} mb="2px">
      <Flex alignItems="center">
        {label && (
          <FormLabel flex={1} ms="4px" fontSize="sm" fontWeight="bold">
            {label}
          </FormLabel>
        )}
        <Box flex={2}>
          <PhoneInput
            id={fieldName}
            name={fieldName}
            value={val}
            onChange={changeHandler}
            onBlur={blurHandler}
            placeholder={label}
            isDisabled={disabled}
          />
          <FormErrorMessage>{error}</FormErrorMessage>
        </Box>
      </Flex>
    </FormControl>
  );
};

export default UIPhoneInputFormControl;
