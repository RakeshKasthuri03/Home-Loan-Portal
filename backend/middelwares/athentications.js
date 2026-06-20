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
        
        // Always verify token — no length-based bypass
        jwt.verify(token, process.env.secretKey, (err, data) => {
            if(err){
                return res.status(401).json({message:"Unauthorized - Invalid token"});
            }
            console.log("Token verified successfully:", data);
            req.user = data;
            next();
        });

    }catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong"});
    }
}

module.exports=auth;
