const Application = require('../models/application.model');
const LoanType = require('../models/loan.model');
const User = require('../models/user.model');

// ═══════════════════════════════════════════════════════════════════════════════
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
        .select('applicationId loanType status basicDetails.fullName basicDetails.mobile financialDetails.loanAmount createdAt processing')
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
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
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


// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN OPERATIONS - Assign Agent, Approve/Reject, Disburse
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Admin: Get all applications with filters
 * GET /api/loan/admin/applications
 */
const getAllApplications = async (req, res) => {
  try {
    const { status, loanType, assignedAgent, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (loanType) query.loanType = loanType;
    if (assignedAgent === 'unassigned') {
      query.assignedAgent = { $exists: false };
    } else if (assignedAgent) {
      query.assignedAgent = assignedAgent;
    }
    
    // Search by applicationId, name, mobile, or email
    if (search) {
      query.$or = [
        { applicationId: { $regex: search, $options: 'i' } },
        { 'basicDetails.fullName': { $regex: search, $options: 'i' } },
        { 'basicDetails.mobile': { $regex: search, $options: 'i' } },
        { 'basicDetails.email': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate('user', 'firstname lastname email phone')
        .populate('assignedAgent', 'name email')
        .select('applicationId loanType status basicDetails.fullName basicDetails.mobile financialDetails.loanAmount assignedAgent createdAt processing')
        .sort({ createdAt: -1 })
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
    console.error('Get all applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
};

/**
 * Admin: Assign agent to application
 * PUT /api/loan/admin/assign/:applicationId
 */
const assignAgent = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({ message: 'Agent ID is required' });
    }

    // Look up agent by _id or agentid field
    const Agent = require('../models/agent.model');
    let agent;
    if (agentId.match(/^[0-9a-fA-F]{24}$/)) {
      agent = await Agent.findById(agentId);
    }
    if (!agent) {
      agent = await Agent.findOne({ agentid: agentId });
    }
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.assignedAgent = agent._id;
    
    // Add assignment note
    application.processing.remarks.push({
      text: `Application assigned to agent`,
      by: req.user.id || req.user._id,
      date: new Date()
    });

    await application.save();

    const updatedApplication = await Application.findById(applicationId)
      .populate('assignedAgent', 'name email');

    res.json({ message: 'Agent assigned successfully', application: updatedApplication });
  } catch (error) {
    console.error('Assign agent error:', error);
    res.status(500).json({ message: 'Failed to assign agent', error: error.message });
  }
};

/**
 * Admin: Approve application
 * PUT /api/loan/admin/approve/:applicationId
 */
const approveApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { sanctionedAmount, sanctionedTenure, interestRate, emiAmount, processingFee } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (!['submitted', 'under_review'].includes(application.status)) {
      return res.status(400).json({ message: 'Application cannot be approved in current status' });
    }

    application.status = 'approved';
    application.processing.approvedAt = new Date();
    application.sanctionedDetails = {
      sanctionedAmount: sanctionedAmount || application.financialDetails.loanAmount,
      sanctionedTenure: sanctionedTenure || application.financialDetails.loanTenure,
      interestRate,
      emiAmount,
      processingFee,
      sanctionDate: new Date()
    };

    application.processing.remarks.push({
      text: 'Application approved',
      by: req.user.id || req.user._id,
      date: new Date()
    });

    await application.save();

    res.json({ message: 'Application approved', application });
  } catch (error) {
    console.error('Approve application error:', error);
    res.status(500).json({ message: 'Failed to approve application', error: error.message });
  }
};

/**
 * Admin: Reject application
 * PUT /api/loan/admin/reject/:applicationId
 */
const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'rejected';
    application.processing.rejectedAt = new Date();
    application.processing.rejectionReason = reason;
    application.processing.remarks.push({
      text: `Application rejected: ${reason}`,
      by: req.user.id || req.user._id,
      date: new Date()
    });

    await application.save();

    res.json({ message: 'Application rejected', application });
  } catch (error) {
    console.error('Reject application error:', error);
    res.status(500).json({ message: 'Failed to reject application', error: error.message });
  }
};

/**
 * Admin: Mark as disbursed
 * PUT /api/loan/admin/disburse/:applicationId
 */
const disburseApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { disbursedAmount, accountNumber, ifscCode, transactionRef } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.status !== 'approved') {
      return res.status(400).json({ message: 'Only approved applications can be disbursed' });
    }

    application.status = 'disbursed';
    application.processing.disbursedAt = new Date();
    application.disbursement = {
      disbursedAmount: disbursedAmount || application.sanctionedDetails.sanctionedAmount,
      disbursementDate: new Date(),
      accountNumber,
      ifscCode,
      transactionRef
    };

    application.processing.remarks.push({
      text: `Loan disbursed: ₹${disbursedAmount || application.sanctionedDetails.sanctionedAmount}`,
      by: req.user.id || req.user._id,
      date: new Date()
    });

    await application.save();

    res.json({ message: 'Loan disbursed successfully', application });
  } catch (error) {
    console.error('Disburse application error:', error);
    res.status(500).json({ message: 'Failed to disburse loan', error: error.message });
  }
};

/**
 * Admin: Close application
 * PUT /api/loan/admin/close/:applicationId
 */
const closeApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { reason } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'closed';
    application.processing.remarks.push({
      text: `Application closed: ${reason || 'Loan completed'}`,
      by: req.user.id || req.user._id,
      date: new Date()
    });

    await application.save();

    res.json({ message: 'Application closed', application });
  } catch (error) {
    console.error('Close application error:', error);
    res.status(500).json({ message: 'Failed to close application', error: error.message });
  }
};


// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD STATS & ANALYTICS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get dashboard stats (Admin)
 * GET /api/loan/admin/stats
 */
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalApplications,
      statusCounts,
      loanTypeCounts,
      recentApplications,
      monthlyTrend
    ] = await Promise.all([
      Application.countDocuments(),
      Application.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Application.aggregate([
        { $group: { _id: '$loanType', count: { $sum: 1 }, totalAmount: { $sum: '$financialDetails.loanAmount' } } }
      ]),
      Application.find()
        .select('applicationId loanType status basicDetails.fullName financialDetails.loanAmount createdAt')
        .sort({ createdAt: -1 })
        .limit(5),
      Application.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            count: { $sum: 1 },
            totalAmount: { $sum: '$financialDetails.loanAmount' }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    // Transform status counts to object
    const statusStats = {};
    statusCounts.forEach(s => { statusStats[s._id] = s.count; });

    // Transform loan type counts
    const loanTypeStats = {};
    loanTypeCounts.forEach(l => { 
      loanTypeStats[l._id] = { count: l.count, totalAmount: l.totalAmount }; 
    });

    res.json({
      totalApplications,
      statusStats,
      loanTypeStats,
      recentApplications,
      monthlyTrend
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
};

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


// ═══════════════════════════════════════════════════════════════════════════════
// LOAN TYPES MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get all loan types
 * GET /api/loan/types
 */
const getLoanTypes = async (req, res) => {
  try {
    const loanTypes = await LoanType.find({ isActive: true });
    res.json({ loanTypes });
  } catch (error) {
    console.error('Get loan types error:', error);
    res.status(500).json({ message: 'Failed to fetch loan types', error: error.message });
  }
};

/**
 * Create loan type (Admin)
 * POST /api/loan/types
 */
const createLoanType = async (req, res) => {
  try {
    const loanType = new LoanType(req.body);
    await loanType.save();
    res.status(201).json({ message: 'Loan type created', loanType });
  } catch (error) {
    console.error('Create loan type error:', error);
    res.status(500).json({ message: 'Failed to create loan type', error: error.message });
  }
};

/**
 * Update loan type (Admin)
 * PUT /api/loan/types/:id
 */
const updateLoanType = async (req, res) => {
  try {
    const loanType = await LoanType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!loanType) {
      return res.status(404).json({ message: 'Loan type not found' });
    }
    res.json({ message: 'Loan type updated', loanType });
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
  
  // Agent operations
  getAgentApplications,
  startReview,
  requestDocuments,
  addRemarks,
  recommendApplication,
  getAgentStats,
  verifyDocument,
  
  // Admin operations
  getAllApplications,
  assignAgent,
  approveApplication,
  rejectApplication,
  disburseApplication,
  closeApplication,
  getDashboardStats,
  
  // Loan types
  getLoanTypes,
  createLoanType,
  updateLoanType
};
