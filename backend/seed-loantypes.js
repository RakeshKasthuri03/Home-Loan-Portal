const mongoose = require('mongoose');
require('dotenv').config();
const LoanType = require('./models/loan.model');

// Loan types data matching frontend loanTypes.js
const loanTypesData = [
  {
    key: 'PURCHASE',
    label: 'Home Purchase Loan',
    icon: '🏠',
    title: 'Home Loan',
    description: 'Finance the purchase of a ready-to-move or under-construction residential property.',
    interestRate: 'From 8.5% p.a.',
    maxAmount: '₹5 Cr',
    maxTenure: '30 yrs',
    approvalTime: '48 hrs',
    eligibility: [
      'Salaried & self employed eligible',
      'Tax benefit under sec 80C and 24B',
      'Upto 90% of property value funded'
    ],
    isActive: true
  },
  {
    key: 'PLOT',
    label: 'Plot Loan',
    icon: '🌎',
    title: 'Plot Loan',
    description: 'Purchase a residential plot to build your dream home at your own place.',
    interestRate: 'From 9.05% p.a.',
    maxAmount: '₹3 Cr',
    maxTenure: '20 yrs',
    approvalTime: '72 hrs',
    eligibility: [
      'Upto 75% of plot value funded',
      'DTCP/HMDA approved plots only',
      'Top-up available for construction'
    ],
    isActive: true
  },
  {
    key: 'NRI',
    label: 'NRI Home Loan',
    icon: '🏘️',
    title: 'NRI Home Loan',
    description: 'Specially designed for Non-Resident Indians to invest in property back home.',
    interestRate: 'From 8.8% p.a.',
    maxAmount: '₹5 Cr',
    maxTenure: '25 yrs',
    approvalTime: '5 days',
    eligibility: [
      'NRO/NRE account repayment',
      'Power of attorney repayment',
      'FEMA compliant, online process'
    ],
    isActive: true
  },
  {
    key: 'RENOVATION',
    label: 'Home Renovation Loan',
    icon: '🔧',
    title: 'Home Renovation Loan',
    description: 'Upgrade, repair or remodel your existing home with a quick and simple loan.',
    interestRate: 'From 9.5% p.a.',
    maxAmount: '₹50 L',
    maxTenure: '15 yrs',
    approvalTime: '24 hrs',
    eligibility: [
      'Non collateral upto ₹10 L',
      'Covers flooring, plumbing, electrical',
      'Minimal documentation required'
    ],
    isActive: true
  },
  {
    key: 'BALANCE_TRANSFER',
    label: 'Balance Transfer',
    icon: '🔄',
    title: 'Balance Transfer',
    description: 'Transfer your existing home loan to us and save more with lower EMIs and better interest rates.',
    interestRate: 'From 8.6% p.a.',
    maxAmount: '₹5 Cr',
    maxTenure: '30 yrs',
    approvalTime: '48 hrs',
    eligibility: [
      'Lower interest rate than existing loan',
      'Top-up loan available if eligible',
      'Simple transfer with minimal charges'
    ],
    isActive: true
  }
];

const seedLoanTypes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Clear existing loan types
    await LoanType.deleteMany({});
    console.log('🗑️  Cleared existing loan types');

    // Insert new loan types
    const result = await LoanType.insertMany(loanTypesData);
    console.log(`✅ Inserted ${result.length} loan types:`);
    
    result.forEach(lt => {
      console.log(`   - ${lt.key}: ${lt.title}`);
    });

    console.log('\n🎉 Seed completed successfully!');
    
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
    process.exit(0);
  }
};

seedLoanTypes();
