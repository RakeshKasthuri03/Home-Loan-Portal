import * as Yup from "yup";
import {
  nameValidation,
  emailValidation,
  phoneValidation,
} from "./CommonValidation";

// ─── REUSABLE LOAN FIELD SCHEMAS ──────────────────────────────────────────────

export const panValidation = Yup.string()
  .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, "Invalid PAN format (e.g. ABCDE1234F)")
  .required("PAN card number is required");

export const aadharLast4Validation = Yup.string()
  .matches(/^\d{4}$/, "Enter exactly 4 digits")
  .required("Last 4 digits of Aadhar are required");

export const pinCodeValidation = Yup.string()
  .matches(/^\d{6}$/, "Enter a valid 6-digit PIN code")
  .required("PIN code is required");

export const dobValidation = Yup.string()
  .required("Date of birth is required")
  .test("min-age", "Applicant must be at least 18 years old", (val) => {
    if (!val) return false;
    const age = Math.floor((new Date() - new Date(val)) / (365.25 * 24 * 60 * 60 * 1000));
    return age >= 18;
  })
  .test("max-age", "Applicant age must be below 70 years", (val) => {
    if (!val) return false;
    const age = Math.floor((new Date() - new Date(val)) / (365.25 * 24 * 60 * 60 * 1000));
    return age <= 70;
  });

export const loanAmountValidation = Yup.string()
  .required("Loan amount is required")
  .test("min-amount", "Minimum loan amount is ₹1,00,000", (val) => Number(val) >= 100000)
  .test("max-amount", "Maximum loan amount is ₹10 Crore", (val) => Number(val) <= 100000000);

export const monthlyIncomeValidation = Yup.string()
  .required("Monthly income is required")
  .test("min-income", "Monthly income must be at least ₹10,000", (val) => Number(val) >= 10000);

export const passportValidation = Yup.string()
  .matches(/^[A-Z][1-9][0-9]{7}$/i, "Invalid passport format (e.g. A1234567)")
  .required("Passport number is required");

export const interestRateValidation = Yup.string()
  .required("Interest rate is required")
  .test("valid-rate", "Enter a valid interest rate between 1% and 30%", (val) => {
    const n = parseFloat(val);
    return !isNaN(n) && n >= 1 && n <= 30;
  });

// ─── STEP SCHEMAS ─────────────────────────────────────────────────────────────

export const basicDetailsSchema = Yup.object({
  fullName:             nameValidation,
  dob:                  dobValidation,
  gender:               Yup.string().required("Gender is required"),
  mobile:               phoneValidation,
  email:                emailValidation,
  panCard:              panValidation,
  aadharLast4:          aadharLast4Validation,
  maritalStatus:        Yup.string().required("Marital status is required"),
  residentialAddress:   Yup.string().min(5, "Residential address is required").required("Residential address is required"),
  city:                 Yup.string().required("City is required"),
  state:                Yup.string().required("State is required"),
  pinCode:              pinCodeValidation,
});

export const employmentSchema = Yup.object({
  employmentType:  Yup.string().required("Employment type is required"),
  companyName:     Yup.string().min(2, "Company name is required").required("Company name is required"),
  designation:     Yup.string().min(2, "Designation is required").required("Designation is required"),
  workExperience:  Yup.string().required("Work experience is required"),
  monthlyIncome:   monthlyIncomeValidation,
  officeAddress:   Yup.string().min(5, "Office address is required").required("Office address is required"),
});

export const financialSchema = Yup.object({
  loanAmount:    loanAmountValidation,
  loanTenure:    Yup.string().required("Loan tenure is required"),
  existingLoans: Yup.string().required("Please select existing loans status"),
  bankName:      Yup.string().min(2, "Bank name is required").required("Bank name is required"),
  accountType:   Yup.string().required("Account type is required"),
  cibilScore:    Yup.string().required("CIBIL score is required"),
});

export const consentSchema = Yup.object({
  consentDeclaration: Yup.boolean().oneOf([true], "You must accept this declaration").required(),
  consentCreditCheck: Yup.boolean().oneOf([true], "You must authorize the credit check").required(),
  consentMarketing:   Yup.boolean(),
  eSignature:         Yup.string().min(2, "Digital signature (full name) is required").required("Digital signature is required"),
});

// ─── FIELD-LEVEL VALIDATOR MAP ────────────────────────────────────────────────
// Maps field `pattern` → validator function used in LoanApplicationContainer

export const FIELD_VALIDATORS = {
  fullName:      (v) => runYup(nameValidation, v),
  mobile:        (v) => runYup(phoneValidation, v),
  email:         (v) => runYup(emailValidation, v),
  panCard:       (v) => runYup(panValidation, v),
  aadharLast4:   (v) => runYup(aadharLast4Validation, v),
  dob:           (v) => runYup(dobValidation, v),
  pinCode:       (v) => runYup(pinCodeValidation, v),
  loanAmount:    (v) => runYup(loanAmountValidation, v),
  monthlyIncome: (v) => runYup(monthlyIncomeValidation, v),
  passport:      (v) => runYup(passportValidation, v),
  currentROI:    (v) => runYup(interestRateValidation, v),
};

// Helper — validates a single value with a Yup schema, returns error string or null
function runYup(schema, value) {
  try {
    schema.validateSync(value);
    return null;
  } catch (err) {
    return err.message || "Invalid value";
  }
}
