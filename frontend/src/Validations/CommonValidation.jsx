import * as Yup from "yup";
export const nameValidation = Yup.string()  
  .required("This field is required");

export const emailValidation = Yup.string()
  .email("Invalid email")
  .required("Email is required");

export const phoneValidation = Yup.string()
  .matches(/^[0-9]{10}$/, "Enter valid 10 digit number")
  .required("Phone number is required");

export const passwordValidation = Yup.string()
  .min(6, "Minimum 6 characters")
  .required("Password is required");