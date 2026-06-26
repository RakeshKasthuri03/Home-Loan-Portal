const mongoose = require('mongoose');

// ═══════════════════════════════════════════════════════════════════════════════
// LOAN TYPE SCHEMA - Defines available loan products
// ═══════════════════════════════════════════════════════════════════════════════

const loanTypeSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    enum: ['PURCHASE', 'PLOT', 'NRI', 'RENOVATION', 'BALANCE_TRANSFER']
  },
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🏠'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  interestRate: {
    type: String,
    default: 'From 8.5% p.a.'
  },
  maxAmount: {
    type: String,
    default: '₹5 Cr'
  },
  maxTenure: {
    type: String,
    default: '30 yrs'
  },
  approvalTime: {
    type: String,
    default: '48 hrs'
  },
  eligibility: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const LoanType = mongoose.model('LoanType', loanTypeSchema);

module.exports = LoanType;
