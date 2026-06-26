const user = require("../models/user.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Application = require('../models/application.model');
const Agent = require('../models/agent.model');

const adminsignup = async (req, res) => {
    const { firstname, lastname, email, phone, gender, password, confirmpassword } = req.body;
    try {
        const existingAdmin = await user.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        if (password !== confirmpassword) {
            return res.status(400).json({ message: "Passwords don't match" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newAdmin = new user({ firstname, lastname, email, phone, gender, password: hashedPassword, confirmpassword: hashedPassword, role: "admin" });
        await newAdmin.save();

        console.log(newAdmin)
        res.status(201).json({ message: "Admin created successfully" });
    }
    catch (err) {
        console.error("Error creating admin:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
}

/**
 * Admin: Get all applications with filters
 * GET /api/admin/applications
 */
const getAllApplications = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) query.status = status;

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
                .populate('assignedAgent', 'firstname lastname email')
                .select('applicationId loanType status basicDetails.fullName basicDetails.mobile financialDetails.loanAmount financialDetails.accountNumber financialDetails.ifscCode sanctionedDetails.sanctionedAmount sanctionedDetails.processingFee sanctionedDetails.sanctionedTenure assignedAgent createdAt processing')
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
 * Admin: Get pending closure requests
 * GET /api/admin/closure-requests
 */
const getClosureRequests = async (req, res) => {
    try {
        const apps = await Application.find({ 'documents.foreclosureLetter.status': 'pending' })
            .select('applicationId loanType status basicDetails.fullName financialDetails.loanAmount documents processing user')
            .populate('user', 'firstname lastname email');
        res.json({ applications: apps });
    } catch (error) {
        console.error('Get closure requests error:', error);
        res.status(500).json({ message: 'Failed to fetch closure requests', error: error.message });
    }
};

/**
 * Admin: Assign agent to application
 * PUT /api/admin/assign/:applicationId
 */
const assignAgent = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { agentId } = req.body;

        if (!agentId) {
            return res.status(400).json({ message: 'Agent ID is required' });
        }

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
        application.processing.remarks.push({
            text: `Application assigned to agent`,
            by: req.user.id || req.user._id,
            date: new Date()
        });

        await application.save();

        const updatedApplication = await Application.findById(applicationId)
            .populate('assignedAgent', 'firstname lastname email');

        res.json({ message: 'Agent assigned successfully', application: updatedApplication });
    } catch (error) {
        console.error('Assign agent error:', error);
        res.status(500).json({ message: 'Failed to assign agent', error: error.message });
    }
};

/**
 * Admin: Approve application
 * PUT /api/admin/approve/:applicationId
 */
const approveApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { sanctionedTenure, interestRate, emiAmount, processingFee } = req.body;

        const application = await Application.findById(applicationId);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        if (!['under_review'].includes(application.status)) {
            return res.status(400).json({ message: 'Application cannot be approved in current status' });
        }

        application.status = 'approved';
        application.processing.approvedAt = new Date();
        const requestedAmount = application.financialDetails?.loanAmount || 0;
        application.sanctionedDetails = {
            sanctionedAmount: requestedAmount,
            sanctionedTenure: sanctionedTenure || application.financialDetails?.loanTenure,
            interestRate,
            emiAmount,
            processingFee: processingFee || 0,
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
 * PUT /api/admin/reject/:applicationId
 */
const rejectApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { reason } = req.body;

        if (!reason) return res.status(400).json({ message: 'Rejection reason is required' });

        const application = await Application.findById(applicationId);
        if (!application) return res.status(404).json({ message: 'Application not found' });

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
 * Admin: Disburse application
 * PUT /api/admin/disburse/:applicationId
 */
const disburseApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { accountNumber, ifscCode } = req.body;

        const application = await Application.findById(applicationId);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        if (application.status !== 'approved') {
            return res.status(400).json({ message: 'Only approved applications can be disbursed' });
        }

        const sanctioned = application.sanctionedDetails?.sanctionedAmount || application.financialDetails?.loanAmount || 0;
        const processingFee = application.sanctionedDetails?.processingFee || 0;
        const computedDisbursed = Number(sanctioned) - Number(processingFee);

        application.status = 'disbursed';
        application.processing.disbursedAt = new Date();
        application.disbursement = {
            disbursedAmount: computedDisbursed,
            disbursementDate: new Date(),
            accountNumber: accountNumber || application.financialDetails?.accountNumber,
            ifscCode: ifscCode || application.financialDetails?.ifscCode
        };

        application.processing.remarks.push({
            text: `Loan disbursed: ₹${computedDisbursed}`,
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
 * PUT /api/admin/close/:applicationId
 */
const closeApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { reason } = req.body;

        const application = await Application.findById(applicationId);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        application.status = 'closed';
        application.processing.remarks.push({
            text: `Application closed: ${reason || 'Loan completed'}`,
            by: req.user.id || req.user._id,
            date: new Date()
        });

        try {
            application.documents = application.documents || {};
            if (application.documents.foreclosureLetter && application.documents.foreclosureLetter.status === 'pending') {
                application.documents.foreclosureLetter.status = 'processed';
                application.documents.foreclosureLetter.processedAt = new Date();
                application.documents.foreclosureLetter.processedBy = req.user.id || req.user._id;
                application.processing.remarks.push({
                    text: `Closure request processed by admin`,
                    by: req.user.id || req.user._id,
                    date: new Date()
                });
            }
        } catch (e) {
            console.warn('Failed to update foreclosureLetter during closeApplication', e);
        }

        await application.save();

        res.json({ message: 'Application closed', application });
    } catch (error) {
        console.error('Close application error:', error);
        res.status(500).json({ message: 'Failed to close application', error: error.message });
    }
};

/**
 * Admin: Dashboard stats
 * GET /api/admin/stats
 */
const getDashboardStats = async (req, res) => {
    try {
        const [
            totalApplications,
            statusCounts,
            loanTypeCounts,
            recentApplications,
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
        ]);

        const statusStats = {};
        statusCounts.forEach(s => { statusStats[s._id] = s.count; });

        const loanTypeStats = {};
        loanTypeCounts.forEach(l => { loanTypeStats[l._id] = { count: l.count, totalAmount: l.totalAmount }; });

        res.json({
            totalApplications,
            statusStats,
            loanTypeStats,
            recentApplications,
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
    }
};

module.exports = {
    adminsignup,
    getAllApplications,
    getClosureRequests,
    assignAgent,
    approveApplication,
    rejectApplication,
    disburseApplication,
    closeApplication,
    getDashboardStats
};
