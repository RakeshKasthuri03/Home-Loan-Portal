const jwt=require('jsonwebtoken');

const auth=async(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        const isCustomAuth=token.length<500;
        console.log("Token received in auth middleware:", token);
        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }
        if(isCustomAuth){
             jwt.verify(token,process.env.secretKey,(err,data)=>{
                console.log(err);
                if(err){
                    return res.status(401).json({message:"Unauthorized"});
                }
               req.user=data;
               console.log("User data extracted from token:", req.user);
            });
        }
               next();
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong"});
    }
}

module.exports=auth;
