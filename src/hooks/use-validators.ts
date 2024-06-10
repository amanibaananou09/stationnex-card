import moment from "moment";
import { useTranslation } from "react-i18next";
import { useESSContext } from "store/ESSContext";
import * as Yup from "yup";
import { Schema } from "yup";

const useValidators = () => {
  const { stationId } = useESSContext();
  const { t } = useTranslation();

  /**
   * Yup Schema Validator
   */

  const name = Yup.string()
    .required(t("validation.name.required"))
    .min(1, t("validation.name.min"));

  const firstName = Yup.string()
    .required(t("validation.firstName.required"))
    .min(3, t("validation.firstName.min"));

  const lastName = Yup.string()
    .min(3, t("validation.lastName.min"))
    .required(t("validation.lastName.required"));

  const phone = Yup.string()
    .required(t("validation.phone.required"))
    .min(10, t("validation.phone.min"));

  const address = Yup.string()
    .required(t("validation.address.required"))
    .min(3, t("validation.address.min"));

  const photo = Yup.mixed().required(t("validation.photo.required"));

  const startValidityDate = Yup.string().required(
    t("validation.date.required"),
  );

  const endValidityDate = Yup.string().required(t("validation.date.required"));

  const startingTime = Yup.string().required(
    t("validation.startingTime.required"),
  );

  const endingTime = Yup.string().required(t("validation.endingTime.required"));

  const rotationName = Yup.string()
    .required(t("validation.rotation.required"))
    .min(3, t("validation.rotation.min"));

  const postName = Yup.string()
    .required(t("validation.post.required"))
    .min(3, t("validation.post.min"));
  const plannedDate = Yup.date()
    .required(t("validation.plannedDate.required"))
    .min(
      moment().format("YYYY-MM-DDTHH:mm"),
      t("validation.plannedDate.greaterThan"),
    );

  const affectedPumpAttendant = Yup.array()
    .of(
      Yup.object().shape({
        pumpId: Yup.number(),
        pumpAttendantId: Yup.number().transform((value) =>
          isNaN(value) ? undefined : value,
        ),
      }),
    )
    .compact((v) => !v.pumpAttendantId)
    .min(1, t("validation.pumpTeam.min"));

  /**
   * validation function for react form hook
   *
   */

  const validateWithSchema = async (schema: Schema, value: any) => {
    return await schema
      .validate(value)
      .then(() => true)
      .catch((err) => err.message);
  };

  const nameValidator = async (value: string) => {
    return await validateWithSchema(name, value);
  };

  const firstNameValidator = async (value: string) => {
    return await validateWithSchema(firstName, value);
  };

  const lastNameValidator = async (value: string) => {
    return await validateWithSchema(lastName, value);
  };

  const phoneValidator = async (value: string) => {
    return await validateWithSchema(phone, value);
  };

  const addressValidator = async (value: string) => {
    return await validateWithSchema(address, value);
  };

  const rotationNameValidator = async (value: string) => {
    return await validateWithSchema(rotationName, value);
  };

  const startValidityDateValidator = async (value: string) => {
    return await validateWithSchema(startValidityDate, value);
  };

  const endValidityDateValidator = async (value: string) => {
    return await validateWithSchema(endValidityDate, value);
  };

  const postNameValidator = async (value: string) => {
    return await validateWithSchema(postName, value);
  };

  const startingTimeValidator = async (value: string) => {
    return await validateWithSchema(startingTime, value);
  };

  const endingTimeValidator = async (value: string) => {
    return await validateWithSchema(endingTime, value);
  };

  const attectedPumpAttendantValidator = async (value: any[]) => {
    return await validateWithSchema(affectedPumpAttendant, value);
  };
  const plannedDateValidator = async (value: Date) => {
    return await validateWithSchema(plannedDate, value);
  };

  return {
    nameValidator,
    firstNameValidator,
    lastNameValidator,
    phoneValidator,
    addressValidator,
    rotationNameValidator,
    startValidityDateValidator,
    endValidityDateValidator,
    postNameValidator,
    startingTimeValidator,
    endingTimeValidator,
    attectedPumpAttendantValidator,
    plannedDateValidator,
  };
};

export default useValidators;
