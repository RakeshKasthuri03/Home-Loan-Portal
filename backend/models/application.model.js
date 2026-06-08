const mongoose = require('mongoose');

// ═══════════════════════════════════════════════════════════════════════════════
// LOAN APPLICATION SCHEMA - Based on frontend loanTypeConfig.js
// ═══════════════════════════════════════════════════════════════════════════════

const applicationSchema = new mongoose.Schema({
  // ─── USER REFERENCE ─────────────────────────────────────────────────────────
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },

  // ─── LOAN TYPE ──────────────────────────────────────────────────────────────
  loanType: {
    type: String,
    required: true,
    enum: ['PURCHASE', 'PLOT', 'NRI', 'RENOVATION', 'BALANCE_TRANSFER']
  },

  // ─── APPLICATION STATUS ─────────────────────────────────────────────────────
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'documents_pending', 'approved', 'rejected', 'disbursed', 'closed'],
    default: 'draft'
  },
  
  applicationId: {
    type: String,
    unique: true,
    sparse: true
  },

  currentStep: {
    type: Number,
    default: 0
  },

  // ─── BASIC DETAILS (All loan types) ─────────────────────────────────────────
  basicDetails: {
    fullName: { type: String },
    dob: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    mobile: { type: String },
    email: { type: String },
    panCard: { type: String },
    aadharLast4: { type: String, maxlength: 4 },
    maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
    residentialAddress: { type: String },
    city: { type: String },
    state: { type: String },
    pinCode: { type: String },
    // NRI specific fields
    overseasMobile: { type: String },
    passport: { type: String },
    countryOfResidence: { type: String },
    visaType: { type: String, enum: ['Work Visa', 'Permanent Residency', 'Citizenship', 'Student Visa'] }
  },

  // ─── CO-APPLICANT DETAILS ───────────────────────────────────────────────────
  coApplicant: {
    hasCoApplicant: { type: String, enum: ['No', 'Yes - Spouse', 'Yes - Parent', 'Yes - Sibling', 'Yes - Other'] },
    coApplicantName: { type: String },
    coApplicantRelation: { type: String },
    coApplicantMobile: { type: String },
    coApplicantIncome: { type: Number },
    coApplicantPAN: { type: String }
  },

  // ─── EMPLOYMENT DETAILS ─────────────────────────────────────────────────────
  employmentDetails: {
    employmentType: { type: String, enum: ['Salaried', 'Self-Employed', 'Business Owner', 'Retired', 'Salaried Abroad', 'Self-Employed Abroad'] },
    companyName: { type: String },
    designation: { type: String },
    workExperience: { type: String },
    monthlyIncome: { type: Number },
    officeAddress: { type: String },
    // NRI specific
    incomeCurrency: { type: String, enum: ['USD', 'AED', 'GBP', 'EUR', 'SGD', 'AUD', 'INR', 'Other'] }
  },

  // ─── FINANCIAL DETAILS ──────────────────────────────────────────────────────
  financialDetails: {
    loanAmount: { type: Number },
    loanTenure: { type: String },
    existingLoans: { type: String },
    existingEMI: { type: Number, default: 0 },
    bankName: { type: String },
    accountType: { type: String, enum: ['Savings', 'Current', 'Salary'] },
    cibilScore: { type: String },
    // NRI specific
    nreAccount: { type: String },
    remittanceMode: { type: String, enum: ['NRE Account', 'NRO Account', 'FCNR Account', 'Direct Remittance'] }
  },

  // ─── PROPERTY DETAILS (PURCHASE & NRI) ──────────────────────────────────────
  propertyDetails: {
    propertyType: { type: String, enum: ['Apartment / Flat', 'Independent House', 'Villa', 'Plot + Construction', 'Under Construction'] },
    propertyLocation: { type: String },
    propertyValue: { type: Number },
    builderName: { type: String },
    possessionStatus: { type: String, enum: ['Ready to Move', 'Under Construction', 'Resale'] },
    propertyAddress: { type: String },
    // NRI specific
    poaHolder: { type: String }
  },

  // ─── PLOT DETAILS (PLOT loan type) ──────────────────────────────────────────
  plotDetails: {
    plotLocation: { type: String },
    plotArea: { type: String },
    plotValue: { type: Number },
    dtcpApproved: { type: String, enum: ['Yes', 'No', 'Pending Approval'] },
    plotPurpose: { type: String, enum: ['Residential Construction', 'Investment', 'Future Use'] },
    sellerName: { type: String },
    plotAddress: { type: String }
  },

  // ─── RENOVATION DETAILS (RENOVATION loan type) ──────────────────────────────
  renovationDetails: {
    renovationType: { type: String, enum: ['Interior Renovation', 'Flooring & Tiling', 'Plumbing & Electrical', 'Extension / Addition', 'Full Home Renovation', 'Other'] },
    propertyOwned: { type: String, enum: ['Yes - Self Owned', 'Yes - Joint Owned', 'No - Rented'] },
    propertyAddress: { type: String },
    estimatedCost: { type: Number },
    contractorName: { type: String }
  },

  // ─── BALANCE TRANSFER DETAILS ───────────────────────────────────────────────
  balanceTransferDetails: {
    currentBank: { type: String },
    currentLoanAmount: { type: Number },
    currentEMI: { type: Number },
    currentROI: { type: String },
    loanStartDate: { type: Date },
    remainingTenure: { type: String },
    loanAccountNo: { type: String },
    topUpRequired: { type: String }
  },

  // ─── DOCUMENTS ──────────────────────────────────────────────────────────────
  documents: {
    panDoc: { url: { type: String }, status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }, uploadedAt: { type: Date } },
    aadharDoc: { url: { type: String }, status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }, uploadedAt: { type: Date } },
    photoDoc: { url: { type: String }, status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }, uploadedAt: { type: Date } },
    salarySlip: { url: { type: String }, status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }, uploadedAt: { type: Date } },
    bankStatement: { url: { type: String }, status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }, uploadedAt: { type: Date } },
    itr: { url: { type: String }, status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }, uploadedAt: { type: Date } },
    propertyDoc: { url: { type: String }, status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }, uploadedAt: { type: Date } },
    plotDoc: { url: { type: String }, status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }, uploadedAt: { type: Date } },
    encumbrance: { url: { type: String }, status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }, uploadedAt: { type: Date } },
    passportDoc: { url: { type: String }, status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }, uploadedAt: { type: Date } },
    visaDoc: { url: { type: String }, status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }, uploadedAt: { type: Date } },
    poaDoc: { url: { type: String }, status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }, uploadedAt: { type: Date } },
    renovationQuote: { url: { type: String }, status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }, uploadedAt: { type: Date } },
    loanStatement: { url: { type: String }, status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }, uploadedAt: { type: Date } },
    foreclosureLetter: { url: { type: String }, status: { type: String, enum: ['pending', 'verified', 'rejected', 'processed'] }, uploadedAt: { type: Date } }
  },

  // ─── CONSENT ────────────────────────────────────────────────────────────────
  consent: {
    consentDeclaration: { type: Boolean, default: false },
    consentCreditCheck: { type: Boolean, default: false },
    consentMarketing: { type: Boolean, default: false },
    eSignature: { type: String },
    consentDate: { type: Date }
  },

  // ─── AGENT ASSIGNMENT ───────────────────────────────────────────────────────
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'agent'
  },

  // ─── PROCESSING DETAILS ─────────────────────────────────────────────────────
  processing: {
    submittedAt: { type: Date },
    reviewedAt: { type: Date },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    disbursedAt: { type: Date },
    remarks: [{ 
      text: String, 
      by: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
      date: { type: Date, default: Date.now }
    }],
    rejectionReason: { type: String }
  },

  // ─── LOAN SANCTIONED DETAILS ────────────────────────────────────────────────
  sanctionedDetails: {
    sanctionedAmount: { type: Number },
    sanctionedTenure: { type: String },
    interestRate: { type: Number },
    emiAmount: { type: Number },
    processingFee: { type: Number },
    sanctionDate: { type: Date },
    sanctionLetter: { type: String }  // Document URL
  },

  // ─── DISBURSEMENT DETAILS ───────────────────────────────────────────────────
  disbursement: {
    disbursedAmount: { type: Number },
    disbursementDate: { type: Date },
    accountNumber: { type: String },
    ifscCode: { type: String },
    transactionRef: { type: String }
  }

}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  minimize: true  // Remove empty objects from documents
});

// ─── PRE-SAVE HOOK: Generate Application ID ───────────────────────────────────
applicationSchema.pre('save', function() {
  if (!this.applicationId) {
    const prefix = this.loanType ? this.loanType.substring(0, 3).toUpperCase() : 'APP';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.applicationId = `MLRR-${prefix}-${timestamp}${random}`;
  }
});

// ─── VIRTUAL: Days Since Submission ───────────────────────────────────────────
applicationSchema.virtual('daysSinceSubmission').get(function() {
  if (!this.processing?.submittedAt) return null;
  const diff = Date.now() - this.processing.submittedAt.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
});

// ─── INDEXES ──────────────────────────────────────────────────────────────────
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ loanType: 1, status: 1 });
applicationSchema.index({ assignedAgent: 1, status: 1 });
applicationSchema.index({ 'basicDetails.mobile': 1 });
applicationSchema.index({ 'basicDetails.email': 1 });
applicationSchema.index({ createdAt: -1 });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
