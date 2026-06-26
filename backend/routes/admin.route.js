const router = require('express').Router();
const auth = require('../middelwares/athentications');
const { isAdmin } = require('../middelwares/roles');
const {
	adminsignup,
	getAllApplications,
	getClosureRequests,
	assignAgent,
	approveApplication,
	rejectApplication,
	disburseApplication,
	closeApplication,
	getDashboardStats
} = require('../controllers/admin.controller');

router.post('/signup', adminsignup);

// Admin-protected operations
router.get('/applications', auth, isAdmin, getAllApplications);
router.get('/stats', auth, isAdmin, getDashboardStats);
router.get('/closure-requests', auth, isAdmin, getClosureRequests);
router.put('/assign/:applicationId', auth, isAdmin, assignAgent);
router.put('/approve/:applicationId', auth, isAdmin, approveApplication);
router.put('/reject/:applicationId', auth, isAdmin, rejectApplication);
router.put('/disburse/:applicationId', auth, isAdmin, disburseApplication);
router.put('/close/:applicationId', auth, isAdmin, closeApplication);

module.exports = router;