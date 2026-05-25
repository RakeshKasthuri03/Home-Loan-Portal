const mongoose =require('mongoose');

const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    middlename:{
        type:String,
        optional:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    userId:{
        type:String,
        unique:true,
    },
    role:{
        type:String,
        default:"user",
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phone:{
        type:String,
        required:true,
        unique:true,
    },
    gender:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,  
    },
    confirmpassword:{
        type:String,
        required:true,  
    }
    ,
    profilePhoto: {
        type: String,
        default: "",
    },
    documents: [
        {
            name: { type: String },
            url: { type: String },
            type: { type: String },
            uploadedAt: { type: Date, default: Date.now },
            verified: { type: Boolean, default: false }
        }
    ]
});
module.exports=mongoose.model("user",userSchema);

