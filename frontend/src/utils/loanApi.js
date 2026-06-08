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
    const response = await api.get('http://localhost:5000/api/loan/types');
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
    const response = await api.post('http://localhost:5000/api/loan/apply', { loanType, ...formData });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Create application error:', error);
    // Return error details including existing application info
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to create application',
      existingApplication: error.response?.data?.existingApplication || null,
      statusCode: error.response?.status
    };
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
    const response = await api.put(`http://localhost:5000/api/loan/save/${applicationId}`, { 
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
    const response = await api.put(`http://localhost:5000/api/loan/submit/${applicationId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Submit application error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to submit application' };
  }
};

/**
 * Upload a loan document file to the backend.
 * @param {File} file
 * @param {string} fieldName
 */
export const uploadLoanDocument = async (file, fieldName) => {
  try {
    const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
    const uploadUrl = `${base}/api/upload`;
    const formData = new FormData();
    formData.append('file', file);
    if (fieldName) formData.append('docName', fieldName);
    formData.append('purpose', 'loan_document');

    const token = getToken();
    const response = await axios.post(uploadUrl, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        'Content-Type': 'multipart/form-data',
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Upload loan document error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to upload loan document',
    };
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

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const adminGetAllApplications = async () => {
  try {
    const response = await api.get('/admin/applications');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Admin get applications error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch applications' };
  }
};

export const adminGetStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Admin get stats error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch stats' };
  }
};

export const adminAssignAgent = async (applicationId, agentId) => {
  try {
    const response = await api.put(`/admin/assign/${applicationId}`, { agentId });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Admin assign agent error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to assign agent' };
  }
};

export const adminApproveApplication = async (applicationId, sanctionData) => {
  try {
    const response = await api.put(`/admin/approve/${applicationId}`, sanctionData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Admin approve error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to approve' };
  }
};

export const adminRejectApplication = async (applicationId, reason) => {
  try {
    const response = await api.put(`/admin/reject/${applicationId}`, { reason });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Admin reject error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to reject' };
  }
};

export const adminDisburseApplication = async (applicationId, disburseData) => {
  try {
    const response = await api.put(`/admin/disburse/${applicationId}`, disburseData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Admin disburse error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to disburse' };
  }
};

export const adminCloseApplication = async (applicationId, reason) => {
  try {
    const response = await api.put(`/admin/close/${applicationId}`, { reason });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Admin close error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to close' };
  }
};

/**
 * Request loan closure (user)
 */
export const requestClosure = async (applicationId, data = {}) => {
  try {
    const response = await api.put(`/closure/${applicationId}`, data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Request closure error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to request closure' };
  }
};

/**
 * Admin: get pending closure requests
 */
export const adminGetClosureRequests = async () => {
  try {
    const response = await api.get('/admin/closure-requests');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Admin get closure requests error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch closure requests' };
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const agentGetApplications = async () => {
  try {
    const response = await api.get('/agent/applications');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Agent get applications error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch applications' };
  }
};

export const agentGetStats = async () => {
  try {
    const response = await api.get('/agent/stats');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Agent get stats error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch stats' };
  }
};

export const agentStartReview = async (applicationId) => {
  try {
    const response = await api.put(`/agent/review/${applicationId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Agent start review error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to start review' };
  }
};

export const agentRequestDocs = async (applicationId, remarks) => {
  try {
    const response = await api.put(`/agent/request-docs/${applicationId}`, { remarks });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Agent request docs error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to request docs' };
  }
};

export const agentAddRemarks = async (applicationId, remarks) => {
  try {
    const response = await api.post(`/agent/remarks/${applicationId}`, { remarks });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Agent add remarks error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to add remarks' };
  }
};

export const agentRecommend = async (applicationId, recommendation) => {
  try {
    const response = await api.put(`/agent/recommend/${applicationId}`, { recommendation });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Agent recommend error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to recommend' };
  }
};

export const agentVerifyDoc = async (applicationId, docField, status) => {
  try {
    const response = await api.put(`/agent/verify-doc/${applicationId}`, { docField, status });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Agent verify doc error:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to update document' };
  }
};

export default {
  getLoanTypes,
  createApplication,
  saveProgress,
  submitApplication,
  getMyApplications,
  getApplicationById,
  deleteApplication,
  uploadLoanDocument,
  adminGetAllApplications,
  adminGetStats,
  adminAssignAgent,
  adminApproveApplication,
  adminRejectApplication,
  adminDisburseApplication,
  agentGetApplications,
  agentGetStats,
  agentStartReview,
  agentRequestDocs,
  agentAddRemarks,
  agentRecommend,
  agentVerifyDoc,
  requestClosure,
  adminGetClosureRequests,
};
