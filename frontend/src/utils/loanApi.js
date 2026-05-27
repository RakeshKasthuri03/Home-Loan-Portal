import axios from 'axios';
import { getToken } from './auth';

const API_BASE = 'http://localhost:5000/api/loan';

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_BASE,
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ═══════════════════════════════════════════════════════════════════════════════
// LOAN TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get all available loan types
 */
export const getLoanTypes = async () => {
  try {
    const response = await api.get('/types');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Get loan types error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch loan types' };
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// USER LOAN OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create a new loan application (draft)
 * @param {string} loanType - Type of loan (PURCHASE, PLOT, NRI, etc.)
 * @param {object} formData - Initial form data
 */
export const createApplication = async (loanType, formData = {}) => {
  try {
    const response = await api.post('/apply', { loanType, ...formData });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Create application error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to create application' };
  }
};

/**
 * Save application progress (auto-save)
 * @param {string} applicationId - Application ID
 * @param {object} formData - Form data to save
 * @param {number} currentStep - Current step number
 */
export const saveProgress = async (applicationId, formData, currentStep) => {
  try {
    const response = await api.put(`/save/${applicationId}`, { 
      currentStep, 
      ...organizeFormData(formData) 
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Save progress error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to save progress' };
  }
};

/**
 * Submit application for review
 * @param {string} applicationId - Application ID
 */
export const submitApplication = async (applicationId) => {
  try {
    const response = await api.put(`/submit/${applicationId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Submit application error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to submit application' };
  }
};

/**
 * Get user's applications
 */
export const getMyApplications = async () => {
  try {
    const response = await api.get('/my-applications');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Get applications error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch applications' };
  }
};

/**
 * Get single application by ID
 * @param {string} applicationId - Application ID
 */
export const getApplicationById = async (applicationId) => {
  try {
    const response = await api.get(`/application/${applicationId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Get application error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch application' };
  }
};

/**
 * Delete draft application
 * @param {string} applicationId - Application ID
 */
export const deleteApplication = async (applicationId) => {
  try {
    const response = await api.delete(`/application/${applicationId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Delete application error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to delete application' };
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Organize flat form data into structured sections for backend
 */
const organizeFormData = (formData) => {
  const basicDetailsFields = ['fullName', 'dob', 'gender', 'mobile', 'email', 'panCard', 'aadharLast4', 
    'maritalStatus', 'residentialAddress', 'city', 'state', 'pinCode', 'overseasMobile', 'passport', 
    'countryOfResidence', 'visaType'];
  
  const coApplicantFields = ['hasCoApplicant', 'coApplicantName', 'coApplicantRelation', 
    'coApplicantMobile', 'coApplicantIncome', 'coApplicantPAN'];
  
  const employmentFields = ['employmentType', 'companyName', 'designation', 'workExperience', 
    'monthlyIncome', 'officeAddress', 'incomeCurrency'];
  
  const financialFields = ['loanAmount', 'loanTenure', 'existingLoans', 'existingEMI', 'bankName', 
    'accountType', 'cibilScore', 'nreAccount', 'remittanceMode'];
  
  const propertyFields = ['propertyType', 'propertyLocation', 'propertyValue', 'builderName', 
    'possessionStatus', 'propertyAddress', 'poaHolder'];
  
  const plotFields = ['plotLocation', 'plotArea', 'plotValue', 'dtcpApproved', 'plotPurpose', 
    'sellerName', 'plotAddress'];
  
  const renovationFields = ['renovationType', 'propertyOwned', 'estimatedCost', 'contractorName'];
  
  const balanceTransferFields = ['currentBank', 'currentLoanAmount', 'currentEMI', 'currentROI', 
    'loanStartDate', 'remainingTenure', 'loanAccountNo', 'topUpRequired'];
  
  const documentFields = ['panDoc', 'aadharDoc', 'photoDoc', 'salarySlip', 'bankStatement', 'itr', 
    'propertyDoc', 'agreementCopy', 'nocCert', 'passportDoc', 'visaDoc', 'overseasAddressProof', 
    'poaDoc', 'plotDoc', 'renovationEstimate'];
  
  const consentFields = ['consentDeclaration', 'consentCreditCheck', 'consentMarketing', 'eSignature'];

  const organized = {};

  // Helper to extract fields
  const extractSection = (fields) => {
    const section = {};
    fields.forEach(field => {
      if (formData[field] !== undefined && formData[field] !== '') {
        section[field] = formData[field];
      }
    });
    return Object.keys(section).length > 0 ? section : null;
  };

  const basicDetails = extractSection(basicDetailsFields);
  if (basicDetails) organized.basicDetails = basicDetails;

  const coApplicant = extractSection(coApplicantFields);
  if (coApplicant) organized.coApplicant = coApplicant;

  const employmentDetails = extractSection(employmentFields);
  if (employmentDetails) organized.employmentDetails = employmentDetails;

  const financialDetails = extractSection(financialFields);
  if (financialDetails) organized.financialDetails = financialDetails;

  const propertyDetails = extractSection(propertyFields);
  if (propertyDetails) organized.propertyDetails = propertyDetails;

  const plotDetails = extractSection(plotFields);
  if (plotDetails) organized.plotDetails = plotDetails;

  const renovationDetails = extractSection(renovationFields);
  if (renovationDetails) organized.renovationDetails = renovationDetails;

  const balanceTransferDetails = extractSection(balanceTransferFields);
  if (balanceTransferDetails) organized.balanceTransferDetails = balanceTransferDetails;

  const documents = extractSection(documentFields);
  if (documents) organized.documents = documents;

  const consent = extractSection(consentFields);
  if (consent) organized.consent = consent;

  return organized;
};

export default {
  getLoanTypes,
  createApplication,
  saveProgress,
  submitApplication,
  getMyApplications,
  getApplicationById,
  deleteApplication,
};
