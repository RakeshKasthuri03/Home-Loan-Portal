const e = require('express');
const User=require('../models/user.model');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');



const getUsers=async(req,res)=>{
    try{
       
        const user=await User.find();
        res.status(200).json(user);
    }
    catch(error){
        res.status(500).json({message:"Something went wrong"});
    }
}
const getuser=async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({message:"Something went wrong"}); 
    
    }
}

const updateuser=async(req,res)=>{
    const {id}=req.params;
    const {firstname,lastname,email,phone,gender}=req.body;
    try{
        const existingUser  =await User.findById(id);
        if(!existingUser){
            return res.status(404).json({message:"User doesn't exist"});
        }
        const updatedUser=await User.findByIdAndUpdate(id,{firstname,lastname,email,phone,gender},{new:true});
        res.status(200).json({message:"User updated successfully",updatedUser});
    }
    catch(error){
        res.status(500).json({message:"Something went wrong"});
    }
}   




















const signin=async (req,res)=>{
      const {email,password}=req.body;
        try{
            console.log("Signin request received with data:", {email, password: password});
            const existingUser=await User.findOne({email:email});
            console.log(existingUser);
            if(!existingUser){
                return res.status(404).json({message:"User doesn't exist"});
            }
          

            
            console.log("Comparing provided password with stored hash for user:", existingUser.password,password);
          const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

          
            console.log("Password Match:", isPasswordCorrect);
            if(isPasswordCorrect){
                jwt.sign({id:existingUser._id},process.env.secretKey,(err,token)=>{
                    if(err){
                        return res.status(500).json({message:"Something went wrong"});
                    }
              console.log("Generated JWT Token:", token);
                   
                    return res.status(200).json({result:existingUser,token,message:"User signed in successfully"});
                });
            }else{
                return res.status(400).json({message:"Invalid credentials"});
            }
          
        }catch(error){
            res.status(500).json({message:"Something went wrong"});
        }
}


const signup=async(req,res)=>{
    const {firstname,lastname,email,phone,gender,password,confirmpassword}=req.body;
    try{
        
        console.log("Signup request received with data:", {firstname,lastname,email,phone,gender,password,confirmpassword});
        const existingUser=await User.findOne({email:email});
        if(existingUser){
            console.log("User already exists:", existingUser);
            return res.status(400).json({message:"User already exists"});
        }
         console.log(firstname,lastname,email,phone,gender,password,confirmpassword);
    

  

        
        if( password !== confirmpassword){
            return res.status(400).json({message:"Passwords don't match"});
        }
          const count = await User.countDocuments();
          const userId = `USR-${String(count + 1).padStart(5, "0")}`;
      
       const hashedPassword = await bcrypt.hash(password, 8);
         console.log("Hashed Password:", hashedPassword);
        const newUser = new User({firstname,lastname,userId,email,phone,gender,password: hashedPassword,confirmpassword: hashedPassword});
        await newUser.save();
        console.log(newUser);
        res.status(201).json({message:"User created successfully"});
    }catch(error){
        res.status(500).json({message:"Something went wrong"});
    }
    
}

const forgotPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;
        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Email and passwords are required' });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords don't match" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const hashed = await bcrypt.hash(newPassword, 8);
        user.password = hashed;
        user.confirmpassword = hashed;
        await user.save();

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Forgot password error', error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};
module.exports={signin,signup,getUsers,getuser,forgotPassword};