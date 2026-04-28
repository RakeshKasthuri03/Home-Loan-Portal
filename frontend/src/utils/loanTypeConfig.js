// ─── SHARED STEP TEMPLATES ────────────────────────────────────────────────────
const basicDetailsFields = [
  { name: "fullName",      label: "Full Name",       type: "text",   required: true,  placeholder: "Enter your full name" },
  { name: "dob",           label: "Date of Birth",   type: "date",   required: true },
  { name: "gender",        label: "Gender",          type: "select", required: true,  options: ["Select Gender", "Male", "Female", "Other"] },
  { name: "mobile",        label: "Mobile Number",   type: "tel",    required: true,  placeholder: "10-digit mobile number" },
  { name: "email",         label: "Email Address",   type: "email",  required: true,  placeholder: "example@email.com" },
  { name: "panCard",       label: "PAN Card Number", type: "text",   required: true,  placeholder: "ABCDE1234F" },
  { name: "aadhar",        label: "Aadhar Number",   type: "text",   required: true,  placeholder: "12-digit Aadhar number" },
  { name: "maritalStatus", label: "Marital Status",  type: "select", required: true,  options: ["Select Status", "Single", "Married", "Divorced", "Widowed"] },
];

const employmentFields = [
  { name: "employmentType", label: "Employment Type",          type: "select", required: true, options: ["Select Type", "Salaried", "Self-Employed", "Business Owner", "Retired"] },
  { name: "companyName",    label: "Company / Business Name",  type: "text",   required: true, placeholder: "Enter company name" },
  { name: "designation",    label: "Designation",              type: "text",   required: true, placeholder: "Your job title" },
  { name: "workExperience", label: "Total Work Experience",    type: "select", required: true, options: ["Select", "Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"] },
  { name: "monthlyIncome",  label: "Monthly Income (₹)",       type: "number", required: true, placeholder: "Net monthly income" },
  { name: "officeAddress",  label: "Office Address",           type: "textarea", required: true, placeholder: "Full office address" },
];

const financialFields = [
  { name: "loanAmount",    label: "Loan Amount Required (₹)",    type: "number", required: true,  placeholder: "e.g. 5000000" },
  { name: "loanTenure",    label: "Loan Tenure",                 type: "select", required: true,  options: ["Select Tenure", "5 years", "10 years", "15 years", "20 years", "25 years", "30 years"] },
  { name: "existingLoans", label: "Any Existing Loans?",         type: "select", required: true,  options: ["Select", "No", "Yes - Home Loan", "Yes - Car Loan", "Yes - Personal Loan", "Yes - Multiple"] },
  { name: "existingEMI",   label: "Existing EMI per month (₹)",  type: "number", required: false, placeholder: "0 if none" },
  { name: "bankName",      label: "Primary Bank Name",           type: "text",   required: true,  placeholder: "Your salary/savings bank" },
  { name: "accountType",   label: "Account Type",                type: "select", required: true,  options: ["Select", "Savings", "Current", "Salary"] },
  { name: "cibilScore",    label: "Approximate CIBIL Score",     type: "select", required: true,  options: ["Select", "Below 650", "650-700", "700-750", "750-800", "800+", "Don't Know"] },
];

const basicDocFields = [
  { name: "panDoc",        label: "PAN Card",                    type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
  { name: "aadharDoc",     label: "Aadhar Card",                 type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
  { name: "photoDoc",      label: "Passport Size Photo",         type: "file", required: true,  accept: ".jpg,.jpeg,.png" },
  { name: "salarySlip",    label: "Last 3 Salary Slips",         type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
  { name: "bankStatement", label: "Bank Statement (6 months)",   type: "file", required: true,  accept: ".pdf" },
  { name: "itr",           label: "ITR / Form 16",               type: "file", required: false, accept: ".pdf" },
];

// ─── LOAN TYPE CONFIGS ────────────────────────────────────────────────────────
export const LOAN_TYPES = {

  // 1. HOME PURCHASE
  PURCHASE: {
    key: "PURCHASE",
    label: "Home Purchase Loan",
    icon: "🏠",
    steps: [
      { title: "Basic Details",      subtitle: "Tell us about yourself",          fields: basicDetailsFields },
      { title: "Employment Details", subtitle: "Tell us about your work",         fields: employmentFields },
      {
        title: "Financial Details",
        subtitle: "Your financial background",
        fields: financialFields,
      },
      {
        title: "Property Details",
        subtitle: "About the property you want to buy",
        fields: [
          { name: "propertyType",     label: "Property Type",                type: "select", required: true,  options: ["Select Type", "Apartment / Flat", "Independent House", "Villa", "Plot + Construction", "Under Construction"] },
          { name: "propertyLocation", label: "Property Location",            type: "text",   required: true,  placeholder: "City, State" },
          { name: "propertyValue",    label: "Estimated Property Value (₹)", type: "number", required: true,  placeholder: "e.g. 6000000" },
          { name: "builderName",      label: "Builder / Seller Name",        type: "text",   required: false, placeholder: "If known" },
          { name: "possessionStatus", label: "Possession Status",            type: "select", required: true,  options: ["Select", "Ready to Move", "Under Construction", "Resale"] },
          { name: "propertyAddress",  label: "Property Address",             type: "textarea", required: true, placeholder: "Full property address" },
        ],
      },
      { title: "Documents", subtitle: "Upload required documents", fields: basicDocFields },
    ],
  },

  // 2. PLOT LOAN
  PLOT: {
    key: "PLOT",
    label: "Plot Loan",
    icon: "🌎",
    steps: [
      { title: "Basic Details",      subtitle: "Tell us about yourself",  fields: basicDetailsFields },
      { title: "Employment Details", subtitle: "Tell us about your work", fields: employmentFields },
      {
        title: "Financial Details",
        subtitle: "Your financial background",
        fields: financialFields,
      },
      {
        title: "Plot Details",
        subtitle: "About the plot you want to purchase",
        fields: [
          { name: "plotLocation",    label: "Plot Location",                    type: "text",   required: true,  placeholder: "City, State" },
          { name: "plotArea",        label: "Plot Area (sq yards / sq ft)",     type: "text",   required: true,  placeholder: "e.g. 200 sq yards" },
          { name: "plotValue",       label: "Estimated Plot Value (₹)",         type: "number", required: true,  placeholder: "e.g. 3000000" },
          { name: "dtcpApproved",    label: "DTCP / HMDA Approved?",            type: "select", required: true,  options: ["Select", "Yes", "No", "Pending Approval"] },
          { name: "plotPurpose",     label: "Purpose of Plot",                  type: "select", required: true,  options: ["Select", "Residential Construction", "Investment", "Future Use"] },
          { name: "sellerName",      label: "Seller / Developer Name",          type: "text",   required: false, placeholder: "If known" },
          { name: "plotAddress",     label: "Plot Address",                     type: "textarea", required: true, placeholder: "Full plot address" },
        ],
      },
      {
        title: "Documents",
        subtitle: "Upload required documents",
        fields: [
          { name: "panDoc",        label: "PAN Card",                    type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
          { name: "aadharDoc",     label: "Aadhar Card",                 type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
          { name: "photoDoc",      label: "Passport Size Photo",         type: "file", required: true,  accept: ".jpg,.jpeg,.png" },
          { name: "salarySlip",    label: "Last 3 Salary Slips",         type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
          { name: "bankStatement", label: "Bank Statement (6 months)",   type: "file", required: true,  accept: ".pdf" },
          { name: "plotDoc",       label: "Plot / Sale Deed Documents",  type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
          { name: "encumbrance",   label: "Encumbrance Certificate",     type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
        ],
      },
    ],
  },

  // 3. NRI HOME LOAN
  NRI: {
    key: "NRI",
    label: "NRI Home Loan",
    icon: "🏘️",
    steps: [
      {
        title: "Basic Details",
        subtitle: "Tell us about yourself",
        fields: [
          { name: "fullName",       label: "Full Name",              type: "text",   required: true,  placeholder: "Enter your full name" },
          { name: "dob",            label: "Date of Birth",          type: "date",   required: true },
          { name: "gender",         label: "Gender",                 type: "select", required: true,  options: ["Select Gender", "Male", "Female", "Other"] },
          { name: "mobile",         label: "Mobile Number (India)",  type: "tel",    required: true,  placeholder: "10-digit Indian mobile" },
          { name: "overseasMobile", label: "Overseas Mobile",        type: "tel",    required: false, placeholder: "Country code + number" },
          { name: "email",          label: "Email Address",          type: "email",  required: true,  placeholder: "example@email.com" },
          { name: "panCard",        label: "PAN Card Number",        type: "text",   required: true,  placeholder: "ABCDE1234F" },
          { name: "passport",       label: "Passport Number",        type: "text",   required: true,  placeholder: "Enter passport number" },
          { name: "countryOfResidence", label: "Country of Residence", type: "text", required: true,  placeholder: "e.g. USA, UAE, UK" },
          { name: "visaType",       label: "Visa / Residency Type",  type: "select", required: true,  options: ["Select", "Work Visa", "Permanent Residency", "Citizenship", "Student Visa"] },
        ],
      },
      {
        title: "Employment Details",
        subtitle: "Your overseas employment",
        fields: [
          { name: "employmentType",  label: "Employment Type",          type: "select", required: true,  options: ["Select Type", "Salaried Abroad", "Self-Employed Abroad", "Business Owner"] },
          { name: "companyName",     label: "Employer / Company Name",  type: "text",   required: true,  placeholder: "Company name" },
          { name: "workExperience",  label: "Total Work Experience",    type: "select", required: true,  options: ["Select", "Less than 1 year", "1-3 years", "3-5 years", "5+ years"] },
          { name: "monthlyIncome",   label: "Monthly Income (₹ equiv)", type: "number", required: true,  placeholder: "Converted to INR" },
          { name: "incomeCurrency",  label: "Income Currency",          type: "select", required: true,  options: ["Select", "USD", "AED", "GBP", "EUR", "SGD", "AUD", "Other"] },
        ],
      },
      {
        title: "Financial Details",
        subtitle: "Your financial background",
        fields: [
          { name: "loanAmount",    label: "Loan Amount Required (₹)",   type: "number", required: true,  placeholder: "e.g. 5000000" },
          { name: "loanTenure",    label: "Loan Tenure",                 type: "select", required: true,  options: ["Select Tenure", "5 years", "10 years", "15 years", "20 years", "25 years"] },
          { name: "nreAccount",    label: "NRE / NRO Account Number",   type: "text",   required: true,  placeholder: "Indian bank account" },
          { name: "bankName",      label: "Indian Bank Name",            type: "text",   required: true,  placeholder: "Bank where NRE/NRO held" },
          { name: "remittanceMode",label: "Repayment Mode",              type: "select", required: true,  options: ["Select", "NRE Account", "NRO Account", "FCNR Account", "Direct Remittance"] },
          { name: "cibilScore",    label: "Approximate CIBIL Score",    type: "select", required: true,  options: ["Select", "Below 650", "650-700", "700-750", "750-800", "800+", "Don't Know"] },
        ],
      },
      {
        title: "Property Details",
        subtitle: "About the property in India",
        fields: [
          { name: "propertyType",     label: "Property Type",                type: "select", required: true,  options: ["Select Type", "Apartment / Flat", "Independent House", "Villa", "Under Construction"] },
          { name: "propertyLocation", label: "Property Location",            type: "text",   required: true,  placeholder: "City, State" },
          { name: "propertyValue",    label: "Estimated Property Value (₹)", type: "number", required: true,  placeholder: "e.g. 6000000" },
          { name: "poaHolder",        label: "Power of Attorney Holder",     type: "text",   required: false, placeholder: "Name of POA holder in India" },
          { name: "propertyAddress",  label: "Property Address",             type: "textarea", required: true, placeholder: "Full property address" },
        ],
      },
      {
        title: "Documents",
        subtitle: "Upload required documents",
        fields: [
          { name: "panDoc",        label: "PAN Card",                      type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
          { name: "passportDoc",   label: "Passport Copy",                 type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
          { name: "visaDoc",       label: "Valid Visa / Residency Proof",  type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
          { name: "photoDoc",      label: "Passport Size Photo",           type: "file", required: true,  accept: ".jpg,.jpeg,.png" },
          { name: "salarySlip",    label: "Last 3 Salary Slips (Overseas)",type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
          { name: "bankStatement", label: "NRE/NRO Bank Statement (6 months)", type: "file", required: true, accept: ".pdf" },
          { name: "poaDoc",        label: "Power of Attorney (if applicable)", type: "file", required: false, accept: ".pdf,.jpg,.jpeg,.png" },
        ],
      },
    ],
  },

  // 4. HOME RENOVATION
  RENOVATION: {
    key: "RENOVATION",
    label: "Home Renovation Loan",
    icon: "🔧",
    steps: [
      { title: "Basic Details",      subtitle: "Tell us about yourself",  fields: basicDetailsFields },
      { title: "Employment Details", subtitle: "Tell us about your work", fields: employmentFields },
      {
        title: "Renovation Details",
        subtitle: "About your renovation project",
        fields: [
          { name: "renovationType",  label: "Type of Renovation",           type: "select", required: true,  options: ["Select", "Interior Renovation", "Flooring & Tiling", "Plumbing & Electrical", "Extension / Addition", "Full Home Renovation", "Other"] },
          { name: "propertyOwned",   label: "Do you own the property?",     type: "select", required: true,  options: ["Select", "Yes - Self Owned", "Yes - Joint Owned", "No - Rented"] },
          { name: "propertyAddress", label: "Property Address",             type: "textarea", required: true, placeholder: "Address of property to renovate" },
          { name: "estimatedCost",   label: "Estimated Renovation Cost (₹)",type: "number", required: true,  placeholder: "e.g. 500000" },
          { name: "loanAmount",      label: "Loan Amount Required (₹)",     type: "number", required: true,  placeholder: "Max ₹50 Lakhs" },
          { name: "loanTenure",      label: "Loan Tenure",                  type: "select", required: true,  options: ["Select Tenure", "1 year", "2 years", "3 years", "5 years", "7 years", "10 years", "15 years"] },
          { name: "contractorName",  label: "Contractor / Vendor Name",     type: "text",   required: false, placeholder: "If finalized" },
          { name: "cibilScore",      label: "Approximate CIBIL Score",      type: "select", required: true,  options: ["Select", "Below 650", "650-700", "700-750", "750-800", "800+", "Don't Know"] },
        ],
      },
      {
        title: "Documents",
        subtitle: "Upload required documents",
        fields: [
          { name: "panDoc",          label: "PAN Card",                      type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
          { name: "aadharDoc",       label: "Aadhar Card",                   type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
          { name: "photoDoc",        label: "Passport Size Photo",           type: "file", required: true,  accept: ".jpg,.jpeg,.png" },
          { name: "salarySlip",      label: "Last 3 Salary Slips",           type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
          { name: "bankStatement",   label: "Bank Statement (6 months)",     type: "file", required: true,  accept: ".pdf" },
          { name: "propertyDoc",     label: "Property Ownership Proof",      type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
          { name: "renovationQuote", label: "Renovation Estimate / Quote",   type: "file", required: false, accept: ".pdf,.jpg,.jpeg,.png" },
        ],
      },
    ],
  },

  // 5. BALANCE TRANSFER
  BALANCE_TRANSFER: {
    key: "BALANCE_TRANSFER",
    label: "Balance Transfer",
    icon: "🔄",
    steps: [
      { title: "Basic Details",      subtitle: "Tell us about yourself",  fields: basicDetailsFields },
      { title: "Employment Details", subtitle: "Tell us about your work", fields: employmentFields },
      {
        title: "Existing Loan Details",
        subtitle: "Details of your current home loan",
        fields: [
          { name: "currentBank",       label: "Current Lender / Bank Name",      type: "text",   required: true,  placeholder: "Bank where loan exists" },
          { name: "currentLoanAmount", label: "Current Outstanding Amount (₹)",  type: "number", required: true,  placeholder: "Remaining principal" },
          { name: "currentEMI",        label: "Current EMI (₹)",                 type: "number", required: true,  placeholder: "Monthly EMI amount" },
          { name: "currentROI",        label: "Current Interest Rate (%)",        type: "text",   required: true,  placeholder: "e.g. 9.5" },
          { name: "loanStartDate",     label: "Loan Start Date",                  type: "date",   required: true },
          { name: "remainingTenure",   label: "Remaining Tenure",                 type: "select", required: true,  options: ["Select", "Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "10-20 years", "20+ years"] },
          { name: "loanAccountNo",     label: "Loan Account Number",              type: "text",   required: true,  placeholder: "Existing loan account number" },
          { name: "topUpRequired",     label: "Top-up Loan Required?",            type: "select", required: true,  options: ["Select", "No", "Yes - ₹5L", "Yes - ₹10L", "Yes - ₹20L", "Yes - Custom Amount"] },
        ],
      },
      {
        title: "Financial Details",
        subtitle: "Your financial background",
        fields: [
          { name: "bankName",    label: "Primary Savings Bank",       type: "text",   required: true, placeholder: "Your salary/savings bank" },
          { name: "accountType", label: "Account Type",               type: "select", required: true, options: ["Select", "Savings", "Current", "Salary"] },
          { name: "cibilScore",  label: "Approximate CIBIL Score",    type: "select", required: true, options: ["Select", "Below 650", "650-700", "700-750", "750-800", "800+", "Don't Know"] },
          { name: "existingEMI", label: "Other EMIs per month (₹)",   type: "number", required: false, placeholder: "Car loan, personal loan etc." },
        ],
      },
      {
        title: "Documents",
        subtitle: "Upload required documents",
        fields: [
          { name: "panDoc",          label: "PAN Card",                        type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
          { name: "aadharDoc",       label: "Aadhar Card",                     type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
          { name: "photoDoc",        label: "Passport Size Photo",             type: "file", required: true,  accept: ".jpg,.jpeg,.png" },
          { name: "salarySlip",      label: "Last 3 Salary Slips",             type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
          { name: "bankStatement",   label: "Bank Statement (6 months)",       type: "file", required: true,  accept: ".pdf" },
          { name: "loanStatement",   label: "Existing Loan Statement",         type: "file", required: true,  accept: ".pdf" },
          { name: "foreclosureLetter",label: "Foreclosure Letter (if available)", type: "file", required: false, accept: ".pdf,.jpg,.jpeg,.png" },
          { name: "propertyDoc",     label: "Property Documents",              type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
        ],
      },
    ],
  },

  // 6. CONSTRUCTION (kept from before)
  CONSTRUCTION: {
    key: "CONSTRUCTION",
    label: "Home Construction Loan",
    icon: "🏗️",
    steps: [
      { title: "Basic Details",      subtitle: "Tell us about yourself",  fields: basicDetailsFields },
      { title: "Employment Details", subtitle: "Tell us about your work", fields: employmentFields },
      {
        title: "Construction Details",
        subtitle: "About your construction project",
        fields: [
          { name: "plotOwned",         label: "Do you own the plot?",              type: "select", required: true,  options: ["Select", "Yes", "No - Will Purchase"] },
          { name: "plotLocation",      label: "Plot Location",                     type: "text",   required: true,  placeholder: "City, State" },
          { name: "plotArea",          label: "Plot Area (sq ft)",                 type: "number", required: true,  placeholder: "e.g. 1200" },
          { name: "constructionCost",  label: "Estimated Construction Cost (₹)",  type: "number", required: true,  placeholder: "e.g. 3000000" },
          { name: "loanAmount",        label: "Loan Amount Required (₹)",          type: "number", required: true,  placeholder: "e.g. 2500000" },
          { name: "loanTenure",        label: "Loan Tenure",                       type: "select", required: true,  options: ["Select Tenure", "5 years", "10 years", "15 years", "20 years", "25 years"] },
          { name: "constructionStage", label: "Current Construction Stage",        type: "select", required: true,  options: ["Select", "Planning Stage", "Foundation Done", "Structure In Progress", "Finishing Stage"] },
          { name: "architectName",     label: "Architect / Engineer Name",         type: "text",   required: false, placeholder: "If appointed" },
        ],
      },
      {
        title: "Documents",
        subtitle: "Upload required documents",
        fields: [
          { name: "panDoc",        label: "PAN Card",                    type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
          { name: "aadharDoc",     label: "Aadhar Card",                 type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
          { name: "photoDoc",      label: "Passport Size Photo",         type: "file", required: true,  accept: ".jpg,.jpeg,.png" },
          { name: "salarySlip",    label: "Last 3 Salary Slips",         type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
          { name: "bankStatement", label: "Bank Statement (6 months)",   type: "file", required: true,  accept: ".pdf" },
          { name: "plotDoc",       label: "Plot / Land Documents",       type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
          { name: "approvedPlan",  label: "Approved Building Plan",      type: "file", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
          { name: "itr",           label: "ITR / Form 16",               type: "file", required: false, accept: ".pdf" },
        ],
      },
    ],
  },
};
