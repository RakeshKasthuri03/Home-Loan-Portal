import * as Yup from "yup";
import {
  nameValidation,
  emailValidation,
  phoneValidation,
  passwordValidation,
} from "./CommonValidation";

export const signupSchema = Yup.object().shape({
  firstName: nameValidation,
  middleName: Yup.string(),
  lastName: nameValidation,

  email: emailValidation,

  countryCode: Yup.string().required(),

  phone: phoneValidation,

  gender: Yup.string().required("Select gender"),

  password: passwordValidation,

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});