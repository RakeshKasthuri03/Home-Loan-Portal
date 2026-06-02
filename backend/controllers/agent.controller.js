const agent=require('../models/agent.model');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');


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
    const {firstname,lastname,email,phone,gender,password,confirmpassword}=req.body;
    try{
        const existingAgent=await agent.findById(id);
        if(!existingAgent){
            return res.status(404).json({message:"Agent doesn't exist"});
        }
        if(password!==confirmpassword){
            return res.status(400).json({message:"Passwords don't match"});
        }
        const hashedPassword=await bcrypt.hash(password,12);
        const updatedAgent=await agent.findByIdAndUpdate(id,{firstname,lastname,email,phone,gender,password:hashedPassword,confirmpassword:hashedPassword},{new:true});
        res.status(200).json({message:"Agent updated successfully",updatedAgent});
    }
    catch(error){
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
        res.status(500).json({message:"Something went wrong"});
    }
}

const agentsignin=async (req,res)=>{
    const {agentid,password}=req.body;

    try{
        console.log("Agent ID received for sign-in:", agentid);
        const existingAgent=await agent.findOne({agentid:agentid.trim()});
        console.log("Existing agent found:", existingAgent);
        if(!existingAgent){
            return res.status(404).json({message:"Agent doesn't exist"});
        }
        const isPasswordCorrect=await bcrypt.compare(password,existingAgent.password);
        if(isPasswordCorrect){
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

module.exports={agentsignup,agentsignin,getagents,getagentbyid,updateagent,deleteagent};

