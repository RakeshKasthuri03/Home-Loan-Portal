const jwt=require('jsonwebtoken');

const auth=async(req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;
        
        // Check if authorization header exists
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header missing" });
        }
        
        const token = authHeader.split(" ")[1];
        
        if(!token){
            return res.status(401).json({message:"Unauthorized - Token missing"});
        }
        
        const isCustomAuth=token.length<500;
        console.log("Token received in auth middleware:", token);
        
        if(isCustomAuth){
             jwt.verify(token,process.env.secretKey,(err,data)=>{
                console.log(err);
                if(err){
                    return res.status(401).json({message:"Unauthorized - Invalid token"});
                }
               req.user=data;
               console.log("User data extracted from token:", req.user);
               next();
            });
        } else {
            next();
        }
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong"});
    }
}

module.exports=auth;
