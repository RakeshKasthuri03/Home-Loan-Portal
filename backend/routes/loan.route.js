const router = require('express').Router();
const auth = require('../middelwares/athentications');
const User = require('../models/user.model');
const Agent = require('../models/agent.model');
const {
  // User operations
  createApplication,
  saveProgress,
  submitApplication,
  getMyApplications,
  getApplicationById,
  deleteApplication,
  requestClosure,
  
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
  getClosureRequests,
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
} = require('../controllers/loan.controller');

// ═══════════════════════════════════════════════════════════════════════════════
// MIDDLEWARE: Role-based access control
// ═══════════════════════════════════════════════════════════════════════════════

const isAgent = async (req, res, next) => {
  try {
    // Check User collection first (admin can also access agent routes)
    let user = await User.findById(req.user.id);
    if (user && (user.role === 'agent' || user.role === 'admin')) {
      req.user.role = user.role;
      return next();
    }
    // Check Agent collection
    const agent = await Agent.findById(req.user.id);
    if (agent && agent.role === 'agent') {
      req.user.role = 'agent';
      return next();
    }
    res.status(403).json({ message: 'Access denied. Agent role required.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error checking role' });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.role === 'admin') {
      req.user.role = user.role;
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error checking role' });
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// Get loan types (public)
router.get('/types', getLoanTypes);

// ═══════════════════════════════════════════════════════════════════════════════
// USER ROUTES (Authenticated users)
// ═══════════════════════════════════════════════════════════════════════════════

// Create new application
router.post('/apply', auth, createApplication);

// Save application progress (auto-save)
router.put('/save/:applicationId', auth, saveProgress);

// Submit application for review
router.put('/submit/:applicationId', auth, submitApplication);

// Get user's applications
router.get('/my-applications', auth, getMyApplications);

// Get single application details
router.get('/application/:applicationId', auth, getApplicationById);

// Delete draft application
router.delete('/application/:applicationId', auth, deleteApplication);
// Request loan closure (user)
router.put('/closure/:applicationId', auth, requestClosure);

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// Get agent's assigned applications
router.get('/agent/applications', auth, isAgent, getAgentApplications);

// Get agent dashboard stats
router.get('/agent/stats', auth, isAgent, getAgentStats);

// Start review
router.put('/agent/review/:applicationId', auth, isAgent, startReview);

// Request additional documents
router.put('/agent/request-docs/:applicationId', auth, isAgent, requestDocuments);

// Add remarks
router.post('/agent/remarks/:applicationId', auth, isAgent, addRemarks);

// Recommend for approval
router.put('/agent/recommend/:applicationId', auth, isAgent, recommendApplication);

// Verify/Reject document
router.put('/agent/verify-doc/:applicationId', auth, isAgent, verifyDocument);

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// Get all applications (with filters)
router.get('/admin/applications', auth, isAdmin, getAllApplications);

// Get admin dashboard stats
router.get('/admin/stats', auth, isAdmin, getDashboardStats);
// Get pending closure requests for admin
router.get('/admin/closure-requests', auth, isAdmin, getClosureRequests);

// Assign agent to application
router.put('/admin/assign/:applicationId', auth, isAdmin, assignAgent);

// Approve application
router.put('/admin/approve/:applicationId', auth, isAdmin, approveApplication);

// Reject application
router.put('/admin/reject/:applicationId', auth, isAdmin, rejectApplication);

// Disburse loan
router.put('/admin/disburse/:applicationId', auth, isAdmin, disburseApplication);

// Close application
router.put('/admin/close/:applicationId', auth, isAdmin, closeApplication);

// ═══════════════════════════════════════════════════════════════════════════════
// LOAN TYPES MANAGEMENT (Admin only)
// ═══════════════════════════════════════════════════════════════════════════════

// Create loan type
router.post('/types', auth, isAdmin, createLoanType);

// Update loan type
router.put('/types/:id', auth, isAdmin, updateLoanType);

module.exports = router;
