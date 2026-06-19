const Application = require('../models/application.model');
const LoanType = require('../models/loan.model');
//══════════════════════════════════
// USER OPERATIONS - Create, Update, View Applications
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create new loan application (Draft) or return existing draft
 * RESTRICTION: Only 1 active application per user at a time
 * POST /api/loan/apply
 */
const createApplication = async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { loanType } = req.body;
  try {

    console.log('Creating application with data:', { userId, loanType });
    if (!loanType) {
      return res.status(400).json({ message: 'Loan type is required' });
    }

    // ✅ Check if user already has ANY active application (draft or submitted)
    const activeApplication = await Application.findOne({
      user: userId,
      status: { $in: ['draft', 'submitted', 'under_review', 'documents_pending'] }
    });

    console.log('Active application check:', { 
      found: !!activeApplication, 
      existingLoanType: activeApplication?.loanType,
      requestedLoanType: loanType,
      status: activeApplication?.status,
      shouldBlock: activeApplication && activeApplication.loanType !== loanType
    });

    if (activeApplication && activeApplication.loanType !== loanType) {
      // User has a different loan type that's still active
      console.log('BLOCKING: User has different loan type active');
      return res.status(403).json({
        message: `You already have a ${activeApplication.loanType} application in progress (Status: ${activeApplication.status}). Please complete or close it before applying for another loan.`,
        existingApplication: {
          id: activeApplication._id,
          loanType: activeApplication.loanType,
          status: activeApplication.status,
          applicationId: activeApplication.applicationId
        }
      });
    }

    // Check if user already has a draft application for THIS loan type
    const existingDraft = await Application.findOne({
      user: userId,
      loanType: loanType,
      status: 'draft'
    });
     
    if (existingDraft) {
      // Return existing draft instead of creating new one
      console.log('Returning existing draft application:', existingDraft._id);
      return res.status(200).json({
        message: 'Existing draft application found',
        application: existingDraft,
        isExisting: true
      });
    }
      
    // Create new application with minimal fields only
    const application = new Application({
      user: userId,
      loanType,
      status: 'draft',
      currentStep: 0
    });

    await application.save();

    res.status(201).json({
      message: 'Application created successfully',
      application,
      isExisting: false
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ message: 'Failed to create application', error: error.message });
  }
};

/**
 * Save application progress (auto-save on each step)
 * PUT /api/loan/save/:applicationId
 */
const saveProgress = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id || req.user._id;
    const { currentStep, ...formData } = req.body;

    console.log('Saving progress for:', { applicationId, userId, currentStep });

    // Support both MongoDB _id and custom applicationId (MLRR-XXX-XXXXX)
    let query = { user: userId };
    if (applicationId.startsWith('MLRR-')) {
      query.applicationId = applicationId;
    } else {
      query._id = applicationId;
    }

    console.log('Query for saveProgress:', query);

    // Find draft OR already submitted - we want to update whichever exists
    let application = await Application.findOne(query);

    if (!application) {
      console.error('Application not found with query:', query);
      console.error('Trying to find by user + loanType only...');
      
      // Fallback: Try to find ANY draft for this user with same loanType
      const fallbackQuery = { user: userId, status: 'draft' };
      application = await Application.findOne(fallbackQuery);
      
      if (!application) {
        console.error('Still not found. Fallback also failed.');
        return res.status(404).json({ message: 'Application not found' });
      }
      
      console.log('Found via fallback:', application._id);
    }

    console.log('Found application:', application._id, 'Status:', application.status);

    // Helper function to clean object data - removes empty objects and invalid values
    const cleanObjectData = (data) => {
      if (!data || typeof data !== 'object') return null;
      const cleaned = {};
      for (const [key, value] of Object.entries(data)) {
        // Skip empty objects, null, undefined
        if (value === null || value === undefined) continue;
        if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) continue;
        // Keep valid primitive values only
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          cleaned[key] = value;
        }
      }
      return Object.keys(cleaned).length > 0 ? cleaned : null;
    };
    // const user = await User.findById(userId);
    //   let name=user.firstname+""+user.lastname;

    //    if(name!=formData.basicDetails.name || user.email!=formData.basicDetails.email || user.phone!=formData.basicDetails.phone){
    //     return res.status(400).json({ message: 'Basic details do not match your profile information' });
    //    }
    // Only update sections that have actual data
    const cleanedBasicDetails = cleanObjectData(formData.basicDetails);
    if (cleanedBasicDetails) {
      application.basicDetails = { ...application.basicDetails?.toObject?.() || {}, ...cleanedBasicDetails };
    }

    const cleanedCoApplicant = cleanObjectData(formData.coApplicant);
    if (cleanedCoApplicant) {
      application.coApplicant = { ...application.coApplicant?.toObject?.() || {}, ...cleanedCoApplicant };
    }

    const cleanedEmploymentDetails = cleanObjectData(formData.employmentDetails);
    if (cleanedEmploymentDetails) {
      application.employmentDetails = { ...application.employmentDetails?.toObject?.() || {}, ...cleanedEmploymentDetails };
    }

    const cleanedFinancialDetails = cleanObjectData(formData.financialDetails);
    if (cleanedFinancialDetails) {
      application.financialDetails = { ...application.financialDetails?.toObject?.() || {}, ...cleanedFinancialDetails };
    }

    const cleanedPropertyDetails = cleanObjectData(formData.propertyDetails);
    if (cleanedPropertyDetails) {
      application.propertyDetails = { ...application.propertyDetails?.toObject?.() || {}, ...cleanedPropertyDetails };
    }

    const cleanedPlotDetails = cleanObjectData(formData.plotDetails);
    if (cleanedPlotDetails) {
      application.plotDetails = { ...application.plotDetails?.toObject?.() || {}, ...cleanedPlotDetails };
    }

    const cleanedRenovationDetails = cleanObjectData(formData.renovationDetails);
    if (cleanedRenovationDetails) {
      application.renovationDetails = { ...application.renovationDetails?.toObject?.() || {}, ...cleanedRenovationDetails };
    }

    const cleanedBalanceTransferDetails = cleanObjectData(formData.balanceTransferDetails);
    if (cleanedBalanceTransferDetails) {
      application.balanceTransferDetails = { ...application.balanceTransferDetails?.toObject?.() || {}, ...cleanedBalanceTransferDetails };
    }

    const cleanedDocuments = cleanObjectData(formData.documents);
    if (cleanedDocuments) {
      const existingDocs = application.documents?.toObject?.() || {};
      // Convert URL strings to {url, status, uploadedAt} format
      Object.entries(cleanedDocuments).forEach(([key, value]) => {
        if (typeof value === 'string' && value.startsWith('http')) {
          existingDocs[key] = { url: value, status: 'pending', uploadedAt: new Date() };
        } else if (typeof value === 'object' && value.url) {
          existingDocs[key] = { ...existingDocs[key], ...value };
        }
      });
      application.documents = existingDocs;
    }

    const cleanedConsent = cleanObjectData(formData.consent);
    if (cleanedConsent) {
      application.consent = { ...application.consent?.toObject?.() || {}, ...cleanedConsent };
    }
    
    if (currentStep !== undefined) application.currentStep = currentStep;

    await application.save();

    res.json({ message: 'Progress saved', application });
  } catch (error) {
    console.error('Save progress error:', error);
    res.status(500).json({ message: 'Failed to save progress', error: error.message });
  }
};

/**
 * Submit application for review
 * PUT /api/loan/submit/:applicationId
 */
const submitApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id || req.user._id;

    // Support both MongoDB _id and custom applicationId (MLRR-XXX-XXXXX)
    let query = { user: userId, status: 'draft' };
    if (applicationId.startsWith('MLRR-')) {
      query.applicationId = applicationId;
    } else {
      query._id = applicationId;
    }

    const application = await Application.findOne(query);

    if (!application) {
      return res.status(404).json({ message: 'Application not found or already submitted' });
    }

    // Validate required fields before submission based on loan type
    const loanType = application.loanType;
    
    // Different loan types have different required fields
    if (loanType === 'BALANCE_TRANSFER') {
      // Balance transfer needs existing loan amount
      if (!application.balanceTransferDetails?.currentLoanAmount) {
        return res.status(400).json({ message: 'Current loan amount is required' });
      }
    } else {
      // Other loan types (PURCHASE, PLOT, NRI, RENOVATION) need loan amount
      if (!application.financialDetails?.loanAmount) {
        return res.status(400).json({ message: 'Loan amount is required' });
      }
    }
    
    // All loan types need consent
    if (!application.consent?.consentDeclaration || !application.consent?.consentCreditCheck) {
      return res.status(400).json({ message: 'Please provide consent to proceed' });
    }

    application.status = 'submitted';
    application.processing = {
      ...application.processing,
      submittedAt: new Date()
    };

    await application.save();

    res.json({ 
      message: 'Application submitted successfully', 
      applicationId: application.applicationId,
      application 
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ message: 'Failed to submit application', error: error.message });
  }
};

/**
 * Get user's applications
 * GET /api/loan/my-applications
 */
const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { status, loanType } = req.query;

    const query = { user: userId };
    if (status) query.status = status;
    if (loanType) query.loanType = loanType;

    const applications = await Application.find(query)
      .select('applicationId loanType status currentStep financialDetails sanctionedDetails processing assignedAgent createdAt')
      .populate('assignedAgent', 'firstname lastname')
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
};

/**
 * Get single application details
 * GET /api/loan/application/:applicationId
 */
const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id || req.user._id;
    const userRole = req.user.role;

    // Support both MongoDB _id and custom applicationId (MLRR-XXX-XXXXX)
    let query;
    if (applicationId.startsWith('MLRR-')) {
      query = { applicationId: applicationId };
    } else {
      query = { _id: applicationId };
    }
    
    // If not admin/agent, only allow viewing own applications
    if (userRole !== 'admin' && userRole !== 'agent') {
      query.user = userId;
    }

    const application = await Application.findOne(query)
      .populate('user', 'firstname lastname email phone')
      .populate('assignedAgent', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ application });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Failed to fetch application', error: error.message });
  }
};

/**
 * Delete draft application
 * DELETE /api/loan/application/:applicationId
 */
const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id || req.user._id;

    const application = await Application.findOneAndDelete({ 
      _id: applicationId, 
      user: userId,
      status: 'draft'
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found or cannot be deleted' });
    }

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Failed to delete application', error: error.message });
  }
};

  /**
   * User: Request loan closure (creates a remark + marks foreclosure letter as pending)
   * PUT /api/loan/closure/:applicationId
   */
  const requestClosure = async (req, res) => {
    try {
      const { applicationId } = req.params;
      const userId = req.user.id || req.user._id;
      const { reason, preferredDate } = req.body;

      const application = await Application.findOne({ _id: applicationId, user: userId });
      if (!application) return res.status(404).json({ message: 'Application not found' });

      // Only allow closure request for disbursed or approved loans
      if (!['disbursed','approved'].includes(application.status)) {
        return res.status(400).json({ message: 'Closure can only be requested for approved/disbursed loans' });
      }

      // Push a processing remark
      application.processing = application.processing || {};
      application.processing.remarks = application.processing.remarks || [];
      application.processing.remarks.push({
        text: `Closure requested by user${reason ? ': ' + reason : ''}`,
        by: userId,
        date: new Date()
      });

      // Mark foreclosureLetter request in documents
      application.documents = application.documents || {};
      application.documents.foreclosureLetter = application.documents.foreclosureLetter || {};
      application.documents.foreclosureLetter.status = 'pending';
      application.documents.foreclosureLetter.uploadedAt = new Date();
      application.documents.foreclosureLetter.requestedAt = new Date();
      application.documents.foreclosureLetter.preferredDate = preferredDate || null;

      await application.save();

      res.json({ message: 'Closure request submitted', application });
    } catch (error) {
      console.error('Request closure error:', error);
      res.status(500).json({ message: 'Failed to submit closure request', error: error.message });
    }
  };

/**
 * User: Resubmit a rejected document
 * PUT /api/loan/resubmit-doc/:applicationId
 */
const resubmitDocument = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id || req.user._id;
    const { docField, fileUrl } = req.body;

    if (!docField || !fileUrl) {
      return res.status(400).json({ message: 'docField and fileUrl are required' });
    }

    const application = await Application.findOne({ _id: applicationId, user: userId });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (!application.documents) application.documents = {};

    // Reset document to pending with new file URL
    application.documents[docField] = {
      url: fileUrl,
      status: 'pending',
      uploadedAt: new Date()
    };

    // Add remark so agent can see the resubmission
    application.processing.remarks.push({
      text: `User resubmitted ${docField} — pending re-verification`,
      by: userId,
      date: new Date()
    });

    // If status was documents_pending and all other docs are now pending/verified, keep it there
    // Agent will re-verify and update status
    await application.save();

    res.json({ message: 'Document resubmitted successfully', application });
  } catch (error) {
    console.error('Resubmit document error:', error);
    res.status(500).json({ message: 'Failed to resubmit document', error: error.message });
  }
};


// ═══════════════════════════════════════════════════════════════════════════════
// AGENT OPERATIONS - View Assigned, Update Status, Add Remarks
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get applications assigned to agent
 * GET /api/loan/agent/applications
 */
const getAgentApplications = async (req, res) => {
  try {
    const agentId = req.user.id || req.user._id;
    const { status, loanType, page = 1, limit = 10 } = req.query;

    const query = { assignedAgent: agentId };
    if (status) query.status = status;
    if (loanType) query.loanType = loanType;

    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate('user', 'firstname lastname email phone')
        .populate('assignedAgent', 'firstname lastname email phone')
        // Return full application record for agents so all form fields are visible in the portal
        .sort({ 'processing.submittedAt': -1 })
        .skip(skip)
        .limit(parseInt(limit)),

      Application.countDocuments(query)
    ]);

    res.json({ 
      applications, 
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get agent applications error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch applications', 
      error: error.message 
    });
  }
};

/**
 * Agent: Start review of application
 * PUT /api/loan/agent/review/:applicationId
 */
const startReview = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const agentId = req.user.id || req.user._id;

    const application = await Application.findOne({ 
      _id: applicationId,
      assignedAgent: agentId,
      status: { $in: ['submitted', 'documents_pending'] }
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found or not assigned to you' });
    }

    application.status = 'under_review';
    application.processing.reviewedAt = new Date();

    await application.save();

    res.json({ message: 'Review started', application });
  } catch (error) {
    console.error('Start review error:', error);
    res.status(500).json({ message: 'Failed to start review', error: error.message });
  }
};

/**
 * Agent: Request additional documents
 * PUT /api/loan/agent/request-docs/:applicationId
 */
const requestDocuments = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const agentId = req.user.id || req.user._id;
    const { remarks } = req.body;

    const application = await Application.findOne({ 
      _id: applicationId,
      assignedAgent: agentId
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found or not assigned to you' });
    }

    application.status = 'documents_pending';
    application.processing.remarks.push({
      text: remarks || 'Additional documents required',
      by: agentId,
      date: new Date()
    });

    await application.save();

    res.json({ message: 'Document request sent', application });
  } catch (error) {
    console.error('Request documents error:', error);
    res.status(500).json({ message: 'Failed to request documents', error: error.message });
  }
};

/**
 * Agent: Add remarks to application
 * POST /api/loan/agent/remarks/:applicationId
 */
const addRemarks = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const agentId = req.user.id || req.user._id;
    const { remarks } = req.body;

    if (!remarks) {
      return res.status(400).json({ message: 'Remarks are required' });
    }

    const application = await Application.findOne({ 
      _id: applicationId,
      assignedAgent: agentId
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found or not assigned to you' });
    }

    application.processing.remarks.push({
      text: remarks,
      by: agentId,
      date: new Date()
    });

    await application.save();

    res.json({ message: 'Remarks added', application });
  } catch (error) {
    console.error('Add remarks error:', error);
    res.status(500).json({ message: 'Failed to add remarks', error: error.message });
  }
};

/**
 * Agent: Recommend for approval (forward to admin)
 * PUT /api/loan/agent/recommend/:applicationId
 */
const recommendApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const agentId = req.user.id || req.user._id;
    const { recommendation } = req.body;

    const application = await Application.findOne({ 
      _id: applicationId,
      assignedAgent: agentId,
      status: 'under_review'
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found or not under review' });
    }

    application.processing.remarks.push({
      text: `Agent Recommendation: ${recommendation || 'Recommended for approval'}`,
      by: agentId,
      date: new Date()
    });

    await application.save();

    res.json({ message: 'Recommendation submitted', application });
  } catch (error) {
    console.error('Recommend application error:', error);
    res.status(500).json({ message: 'Failed to recommend application', error: error.message });
  }
};

/**
 * Agent: Update document status (verify/reject)
 * PUT /api/loan/agent/verify-doc/:applicationId
 */
const verifyDocument = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const agentId = req.user.id || req.user._id;
    const { docField, status } = req.body; // docField: 'panDoc', status: 'verified'|'rejected'

    if (!docField || !status) {
      return res.status(400).json({ message: 'docField and status are required' });
    }

    if (!['verified', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use: verified, rejected, pending' });
    }

    const application = await Application.findOne({
      _id: applicationId,
      assignedAgent: agentId
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found or not assigned to you' });
    }

    if (!application.documents || !application.documents[docField]) {
      return res.status(404).json({ message: 'Document not found' });
    }

    application.documents[docField].status = status;
    await application.save();

    res.json({ message: `Document ${status}`, documents: application.documents });
  } catch (error) {
    console.error('Verify document error:', error);
    res.status(500).json({ message: 'Failed to update document status', error: error.message });
  }
};


// Admin operations have been moved to admin.controller.js


// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD STATS & ANALYTICS (Agent+Admin where appropriate)
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * Get agent dashboard stats
 * GET /api/loan/agent/stats
 */
const getAgentStats = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const agentId = req.user.id || req.user._id;
    const agentObjectId = new mongoose.Types.ObjectId(agentId);

    const [
      totalAssigned,
      statusCounts,
      pendingReview,
      recentApplications
    ] = await Promise.all([
      Application.countDocuments({ assignedAgent: agentObjectId }),
      Application.aggregate([
        { $match: { assignedAgent: agentObjectId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Application.countDocuments({ 
        assignedAgent: agentObjectId, 
        status: { $in: ['submitted', 'documents_pending'] } 
      }),
      Application.find({ assignedAgent: agentObjectId })
        .select('applicationId loanType status basicDetails.fullName financialDetails.loanAmount createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    const statusStats = {};
    statusCounts.forEach(s => { statusStats[s._id] = s.count; });

    res.json({
      totalAssigned,
      statusStats,
      pendingReview,
      recentApplications
    });
  } catch (error) {
    console.error('Get agent stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
};

/**
 * Public: Get available loan types
 * GET /api/loan/types
 */
const getLoanTypes = async (req, res) => {
  try {
    const types = await LoanType.find({ isActive: true }).sort({ key: 1 });
    res.json({ loanTypes: types });
  } catch (error) {
    console.error('Get loan types error:', error);
    res.status(500).json({ message: 'Failed to fetch loan types', error: error.message });
  }
};

/**
 * Admin: Create a new loan type
 * POST /api/loan/types
 */
const createLoanType = async (req, res) => {
  try {
    const payload = req.body;
    const existing = await LoanType.findOne({ key: payload.key });
    if (existing) return res.status(400).json({ message: 'Loan type with this key already exists' });
    const lt = new LoanType(payload);
    await lt.save();
    res.status(201).json({ message: 'Loan type created', loanType: lt });
  } catch (error) {
    console.error('Create loan type error:', error);
    res.status(500).json({ message: 'Failed to create loan type', error: error.message });
  }
};

/**
 * Admin: Update existing loan type
 * PUT /api/loan/types/:id
 */
const updateLoanType = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await LoanType.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Loan type not found' });
    res.json({ message: 'Loan type updated', loanType: updated });
  } catch (error) {
    console.error('Update loan type error:', error);
    res.status(500).json({ message: 'Failed to update loan type', error: error.message });
  }
};

module.exports = {
  // User operations
  createApplication,
  saveProgress,
  submitApplication,
  getMyApplications,
  getApplicationById,
  deleteApplication,
  requestClosure,
  resubmitDocument,
  
  // Agent operations
  getAgentApplications,
  startReview,
  requestDocuments,
  addRemarks,
  recommendApplication,
  getAgentStats,
  verifyDocument,
  getLoanTypes,
  createLoanType,
  updateLoanType,
};
