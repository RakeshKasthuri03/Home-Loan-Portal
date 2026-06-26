import * as Yup from "yup";
import {
  nameValidation,
  phoneValidation,
} from "./CommonValidation";

export const contactSchema = Yup.object({
  name: nameValidation,
  phone: phoneValidation,
  email: Yup.string().email("Invalid email"),
  city: Yup.string().required("City is required"),

  loanAmount: Yup.string().required("Select loan amount"),
  employmentType: Yup.string().required("Select employment type"),

  interests: Yup.array().min(1, "Select at least one option"),
});