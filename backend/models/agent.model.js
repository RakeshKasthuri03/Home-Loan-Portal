const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
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
        enum:["Male", "Female", "Other"],
    },
    password:{
        type:String,
        required:true,
    },
    confirmpassword:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"agent",
    },
    tire:{
        type:String,
        enum:["Silver","Gold","Platinum"],
        default:"Silver",
    },
    loansgiven:{
        type:Number,
        default:0,
    },
    agentid:{
        type:String,
        unique:true,
    }

});


module.exports=mongoose.model("agent",agentSchema);