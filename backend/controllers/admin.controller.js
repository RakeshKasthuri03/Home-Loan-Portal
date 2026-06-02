
const user=require("../models/user.model");
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const adminsignup=async(req,res)=>{
    const {firstname,lastname,email,phone,gender,password,confirmpassword}=req.body;
    try{
        const existingAdmin=await user.findOne({email});
        if(existingAdmin){
            return res.status(400).json({message:"Admin already exists"});
        }
        if(password!==confirmpassword){
            return res.status(400).json({message:"Passwords don't match"});
        }
   
        const hashedPassword=await bcrypt.hash(password,12);
            const newAdmin=new user({firstname,lastname,email,phone,gender,password:hashedPassword,confirmpassword:hashedPassword,role:"admin"});
        await newAdmin.save();

        console.log(newAdmin)
        res.status(201).json({message:"Admin created successfully"});
    }
    catch(err){
        console.error("Error creating admin:", err);
        res.status(500).json({message:"Something went wrong"});
    }
}

module.exports={adminsignup};
