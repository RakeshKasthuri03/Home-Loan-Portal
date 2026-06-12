import * as Yup from "yup";

// ✅ Name: Min 4 chars, Max 10 chars
export const nameValidation = Yup.string()
  .required("This field is required")
  .min(4, "Minimum 4 characters required")
  .max(30, "Maximum 20 characters allowed");


// ✅ Email: Only gmail or outlook + min 4 chars
export const emailValidation = Yup.string()
  .required("Email is required")
  .matches(
    /^[a-zA-Z0-9]+(\.?[a-zA-Z0-9]+)*@(gmail\.com|outlook\.com)$/,
    "Only valid Gmail or Outlook emails are allowed"
  );


// ✅ Phone (with all rules)
export const phoneValidation = Yup.string()
  .required("Phone number is required")
  .matches(/^[6-9][0-9]{9}$/, "Phone must start with 6,7,8,9 and be 10 digits")
  .test(
  "no-repeated-digits",
  "No digit should repeat more than three consecutively",
  (value) => !/(.)\1{3}/.test(value || "")
);

// ✅ Password (basic version)
export const passwordValidation = Yup.string()
  .min(8, "Minimum 8 characters")
  .required("Password is required");