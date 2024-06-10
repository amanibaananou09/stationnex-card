import { useTranslation } from "react-i18next";
import { useESSContext } from "store/ESSContext";
import * as Yup from "yup";

const useFormValidation = () => {
  const { t } = useTranslation();
  const { station } = useESSContext();

  const name = Yup.string()
    .min(4, t("validation.name.min"))
    .required(t("validation.name.required"));

  const firstName = Yup.string()
    .min(4, t("validation.firstName.min"))
    .required(t("validation.firstName.required"));

  const lastName = Yup.string()
    .min(4, t("validation.lastName.min"))
    .required(t("validation.lastName.required"));

  const phone = Yup.string()
    .required(t("validation.phone.required"))
    .min(10, t("validation.phone.min"));

  const address = Yup.string()
    .min(4, t("validation.address.min"))
    .required(t("validation.address.required"));

  const photo = Yup.mixed().required(t("validation.photo.required"));

  const startValidityDate = Yup.string().required(
    t("validation.date.required"),
  );

  const endValidityDate = Yup.string().required(t("validation.date.required"));

  const startingTime = Yup.string().required(
    t("validation.startingTime.required"),
  );

  const endingTime = Yup.string().required(t("validation.endingTime.required"));

  const tagAsync = Yup.string()
    .min(8, t("validation.tag.min"))
    .required(t("validation.tag.required"));

  const matriculeAsync = Yup.string()
    .min(8, t("validation.tag.min"))
    .required(t("validation.tag.required"));

  const editFuelGradeFormValidationSchema = Yup.object().shape({
    name,
  });
  const fuelGradeFormValidationSchema = Yup.object().shape({
    name,
  });
  const pumpTeamFormValidationSchema = Yup.object().shape({
    name,
    affectedPumpAttendant: Yup.array()
      .of(
        Yup.object().shape({
          pumpId: Yup.number(),
          pumpAttendantId: Yup.number(),
        }),
      )
      .compact((v) => v.pumpAttendantId == null)
      .min(1, t("validation.pumpTeam.min")),
  });

  const rotationFormValidationSchema = Yup.object().shape({
    name: Yup.string()
      .min(4, t("validation.rotation.min"))
      .required(t("validation.rotation.required")),
    startValidityDate,
    endValidityDate,
    shifts: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string()
            .min(4, t("validation.post.min"))
            .required(t("validation.post.required")),
          startingTime,
          endingTime,
        }),
      )
      .min(1, "Au moins un poste est requis")
      .required("Au moins un poste est requis"),
  });
  const editRotationFormValidationSchema = Yup.object().shape({
    name: Yup.string()
      .min(4, t("validation.rotation.min"))
      .required(t("validation.rotation.required")),
    startValidityDate,
    endValidityDate,
  });

  const signInFormValidationSchema = Yup.object().shape({
    username: Yup.string().required(t("validation.username.required")),
    password: Yup.string().required(t("validation.password.required")),
  });
  const editFormValidationSchema = Yup.object().shape({
    pumpAttendantId: Yup.string().required("Pompiste est requis"),
  });

  return {
    editFuelGradeFormValidationSchema,
    pumpTeamFormValidationSchema,
    rotationFormValidationSchema,
    editFormValidationSchema,
    editRotationFormValidationSchema,
    signInFormValidationSchema,
    fuelGradeFormValidationSchema,
  };
};

export default useFormValidation;
