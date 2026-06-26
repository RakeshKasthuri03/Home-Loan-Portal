/**
 * LOAN REQUIREMENTS PANEL - USER FLOW
 * 
 * This component shows users exactly what information they need
 * for each loan type BEFORE they start the application.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// USER FLOW
// ═══════════════════════════════════════════════════════════════════════════════

/*
STEP 1: User visits Loan Types page
├─ Sees 5 loan type cards with "Apply for X Loan →" buttons

STEP 2: User clicks "Apply for Home Loan"
├─ Requirements Panel Modal opens (BEFORE application starts)
├─ Shows what info is needed

STEP 3: User sees Requirements Panel with:
├─ Header with loan type name & description
├─ Quick Stats:
│  ├─ Estimated Time: 15-20 min
│  ├─ Steps: 6
│  └─ Documents: 6
├─ Sections:
│  ├─ 👤 Personal Information Required
│  │  ├─ Full Name
│  │  ├─ Date of Birth
│  │  ├─ Mobile Number
│  │  ├─ Email Address
│  │  ├─ PAN Card Number
│  │  └─ Aadhar Last 4 Digits
│  │
│  ├─ 💼 Employment Details Required
│  │  ├─ Employment Type
│  │  ├─ Company/Business Name
│  │  ├─ Designation
│  │  ├─ Total Work Experience
│  │  └─ Monthly Income
│  │
│  ├─ 💰 Financial Information Required
│  │  ├─ Loan Amount Required
│  │  ├─ Loan Tenure
│  │  ├─ Primary Bank Name
│  │  └─ Approximate CIBIL Score
│  │
│  ├─ 🏠 Home Purchase Specific Details
│  │  ├─ Property Type
│  │  ├─ Property Location
│  │  ├─ Estimated Property Value
│  │  ├─ Possession Status
│  │  └─ Property Address
│  │
│  └─ 📎 Documents Required
│     ├─ PAN Card (PDF/JPG/PNG)
│     ├─ Aadhar Card (PDF/JPG/PNG)
│     ├─ Passport Size Photo (JPG/PNG)
│     ├─ Last 3 Salary Slips (PDF/JPG)
│     └─ Bank Statement 6 months (PDF)
│
├─ Bottom Section:
│  ├─ Eligibility criteria
│  └─ Key Benefits (Interest Rate, Max Amount, etc.)
│
└─ Footer Buttons:
   ├─ [Cancel] - Go back
   └─ [Start Application →] - Begin form


STEP 4: User clicks "Start Application"
├─ Modal closes
├─ Form page loads with all required fields ready
└─ User starts filling information


STEP 5: User fills form
├─ All 6 steps are visible
├─ Each field is pre-labeled with what information is needed
└─ User can see progress bar


STEP 6: User submits
├─ Data saved to MongoDB
└─ Success message shown
*/

// ═══════════════════════════════════════════════════════════════════════════════
// WHAT USER SEES - VISUAL STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════════

/*
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  [MODAL OVERLAY - Semi-transparent dark background]              │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ 🏠 HOME PURCHASE LOAN                          [X]            │ │
│  │ Buy your dream home with easy financing options              │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │                                                              │ │
│  │  ⏱️ Estimated Time    📋 Steps    📄 Documents              │ │
│  │     15-20 min           6           6                        │ │
│  │                                                              │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │                                                              │ │
│  │  👤 PERSONAL INFORMATION REQUIRED                            │ │
│  │  ✓ Full Name           ✓ Mobile Number                       │ │
│  │  ✓ Date of Birth       ✓ Email Address                       │ │
│  │  ✓ PAN Card Number     ✓ Aadhar Last 4 Digits               │ │
│  │                                                              │ │
│  │  💼 EMPLOYMENT DETAILS REQUIRED                              │ │
│  │  ✓ Employment Type              ✓ Company Name               │ │
│  │  ✓ Designation                  ✓ Work Experience            │ │
│  │  ✓ Monthly Income                                            │ │
│  │                                                              │ │
│  │  💰 FINANCIAL INFORMATION REQUIRED                            │ │
│  │  ✓ Loan Amount          ✓ Primary Bank Name                  │ │
│  │  ✓ Loan Tenure          ✓ CIBIL Score                        │ │
│  │                                                              │ │
│  │  🏠 HOME PURCHASE SPECIFIC DETAILS                            │ │
│  │  ✓ Property Type         ✓ Property Value                    │ │
│  │  ✓ Property Location     ✓ Possession Status                 │ │
│  │  ✓ Property Address                                          │ │
│  │                                                              │ │
│  │  📎 DOCUMENTS REQUIRED                                        │ │
│  │  ✓ PAN Card (PDF/JPG)           ✓ Aadhar Card (PDF/JPG)     │ │
│  │  ✓ Passport Photo (JPG/PNG)     ✓ Salary Slips (PDF/JPG)    │ │
│  │  ✓ Bank Statement (PDF)                                      │ │
│  │                                                              │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │                                                              │ │
│  │  ┌───────────────────┐        ┌──────────────────────────┐ │ │
│  │  │ 🎯 ELIGIBILITY    │        │ 💡 KEY BENEFITS          │ │ │
│  │  ├───────────────────┤        ├──────────────────────────┤ │ │
│  │  │✓ Age 21-65 years  │        │ Rate: From 8.5% p.a.     │ │ │
│  │  │✓ Stable income    │        │ Max: ₹5 Cr               │ │ │
│  │  │✓ Good credit score│        │ Tenure: Up to 30 years   │ │ │
│  │  │✓ Employed/Self-emp│        │ Approval: 48 hours       │ │ │
│  │  └───────────────────┘        └──────────────────────────┘ │ │
│  │                                                              │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │                          [Cancel]  [Start Application →]    │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
*/

// ═══════════════════════════════════════════════════════════════════════════════
// BENEFITS TO USER
// ═══════════════════════════════════════════════════════════════════════════════

/*
✅ TRANSPARENCY
   - Users know EXACTLY what they need to provide
   - No surprises mid-way through form
   - Reduce form abandonment

✅ FASTER APPLICATION
   - Users can gather documents beforehand
   - Prepare information in advance
   - Smoother form filling experience

✅ BETTER DECISION MAKING
   - Users see time requirement (15-20 min)
   - Users see document count (6 documents)
   - Users understand eligibility criteria
   - Can decide if they're ready before starting

✅ REDUCED ERRORS
   - Users know what format documents need to be
   - Know which fields are required
   - Prepare correct information in advance

✅ PROFESSIONAL APPEARANCE
   - Clear, organized presentation
   - Matches modern loan application standards
   - Builds user confidence
*/

// ═══════════════════════════════════════════════════════════════════════════════
// DIFFERENT LOAN TYPES - DIFFERENT REQUIREMENTS
// ═══════════════════════════════════════════════════════════════════════════════

/*
1. HOME PURCHASE LOAN
   └─ Shows: Property details section + Possession status

2. BALANCE TRANSFER LOAN
   └─ Shows: Current loan details + Refinancing options

3. PLOT LOAN
   └─ Shows: Plot details + DTCP approval

4. NRI LOAN
   └─ Shows: Overseas address + Visa type + Income in foreign currency

5. RENOVATION LOAN
   └─ Shows: Renovation type + Estimate documents

Each loan type has different required fields,
and this panel automatically shows only what's relevant!
*/

export const exampleRequirements = {
  description: `
    This is a modal that shows BEFORE the application form loads.
    It gives users clear visibility into what information they need.
    
    It categorizes information by section:
    - Personal Info
    - Employment Details
    - Financial Info
    - Loan-Specific Info (varies by loan type)
    - Documents
    
    Plus:
    - Estimated time to complete
    - Number of steps
    - Number of documents
    - Eligibility criteria
    - Key benefits
  `
};
