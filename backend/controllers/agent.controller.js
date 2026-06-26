const agent=require('../models/agent.model');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const Application = require('../models/application.model');
const LoanType = require('../models/loan.model');
const User = require('../models/user.model');

const getagents=async(req,res)=>{
    try{
        const agents=await agent.find();
        res.status(200).json(agents);
    }catch(error){
        res.status(500).json({message:"Something went wrong"});
    }
}
const getagentbyid=async(req,res)=>{
    const {id}=req.params;
    try{
        const agentbyid=await agent.findById(id);
        res.status(200).json(agentbyid);
    }catch(error){
        res.status(500).json({message:"Something went wrong"});
    }
}

const updateagent=async(req,res)=>{
    const {id}=req.params;
    const {firstname,lastname,email,phone,gender,password,confirmpassword,profilePhoto,address,loansGiven} = req.body;
    try{
        const existingAgent=await agent.findById(id);
        if(!existingAgent){
            return res.status(404).json({message:"Agent doesn't exist"});
        }

        const updateData = {};
        if(firstname !== undefined) updateData.firstname = firstname;
        if(lastname !== undefined) updateData.lastname = lastname;
        if(email !== undefined) updateData.email = email;
        if(phone !== undefined) updateData.phone = phone;
        if(gender !== undefined) updateData.gender = gender;
        if(profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;
        if(address !== undefined) updateData.address = address;
        if(loansGiven !== undefined) updateData.loansgiven = Number(loansGiven) || 0;

        // Only update password if provided
        if(password || confirmpassword) {
            if(password !== confirmpassword){
                return res.status(400).json({message:"Passwords don't match"});
            }
            const hashedPassword=await bcrypt.hash(password,12);
            updateData.password = hashedPassword;
            updateData.confirmpassword = hashedPassword;
        }

        const updatedAgent=await agent.findByIdAndUpdate(id, updateData, {new:true});
        res.status(200).json({message:"Agent updated successfully",updatedAgent});
    }
    catch(error){
        console.error('Update agent error:', error);
        res.status(500).json({message:"Something went wrong"});
    }
}

const deleteagent=async(req,res)=>{
    const {id}=req.params;
    try{
        const existingAgent=await agent.findById(id);
        if(!existingAgent){
            return res.status(404).json({message:"Agent doesn't exist"});
        }
        await agent.findByIdAndDelete(id);
        res.status(200).json({message:"Agent deleted successfully"});
    }
    catch(error){
        res.status(500).json({message:"Something went wrong"});
    }   
}

const agentsignup=async (req,res)=>{
    const {firstname,lastname,email,phone,gender,password,confirmpassword}=req.body;
    try{
        console.log("Agent signup data received:", {firstname,lastname,email,phone,gender,password,confirmpassword});
        const existingAgent=await agent.findOne({email:email});
        if(existingAgent){
            return res.status(400).json({message:"Agent already exists"});
        }
        
        if(password!==confirmpassword){
            return res.status(400).json({message:"Passwords don't match"});
        }
        const hashedPassword=await bcrypt.hash(password,12);
        const agentid=`AGENT-${Math.floor(Math.random() * 9000)}`;
        console.log("Generated Agent ID:", agentid, "Hashed Password:", hashedPassword);
        console.log("Creating new agent with data:", {agentid});   
        const newAgent=new agent({firstname,lastname,email,phone,gender,password:hashedPassword,confirmpassword:hashedPassword,agentid});
         await newAgent.save();
         console.log("New agent created:", newAgent);
        res.status(201).json({message:"Agent added successfully"});
    }catch(error){
        console.log("Agent signup error:", error);
        res.status(500).json({message:"Something went wrong"});
    }
}

const agentsignin=async (req,res)=>{
    const {agentid,password}=req.body;

    try{
        console.log("Agent ID received for sign-in:", agentid,password);
        const existingAgent=await agent.findOne({agentid:agentid.trim()});
        console.log("Existing agent found:", existingAgent);
        if(!existingAgent){
            return res.status(404).json({message:"Agent doesn't exist"});
        }
        const isPasswordCorrect=await bcrypt.compare(password,existingAgent.password);
       
        if(isPasswordCorrect){
            console.log("Password is correct. Generating JWT token for agent:", existingAgent._id);
            jwt.sign({id:existingAgent._id},process.env.secretKey,(err,token)=>{
                if(err){
                    return res.status(500).json({message:"Something went wrong"});
                }
                return res.status(200).json({result:existingAgent,token,message:"Agent signed in successfully"});
                Console.log("Generated JWT Token:", token);
                 
                

            
            }
            );
        }else{
            return res.status(400).json({message:"Invalid credentials"});
        }
    }catch(error){
        res.status(500).json({message:"Something went wrong"});
    }
}
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

const getAgentApplications = async (req, res) => {
  try {
   
    // console.log('Fetching applications for agent:', req.user.id || req.user._id);
    const agentId = req.user.id || req.user._id;
   // console.log('Fetching applications for agent ID:', agentId);
    const { status, loanType, page = 1, limit = 10 } = req.query;
     
    const query = { assignedAgent: agentId };
    if (status) query.status = status;
    if (loanType) query.loanType = loanType;

    const skip = (page - 1) * limit;
   // console.log('Querying applications with:', query, 'Page:', page, 'Limit:', limit);
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


module.exports={agentsignup,
    agentsignin,
    getagents,
    getagentbyid,
    updateagent,
    deleteagent,
    getAgentStats,
     getAgentApplications,
     startReview,
     requestDocuments,
     addRemarks,
     recommendApplication,
     verifyDocument,
    };

