const router=require('express').Router();
const {signin,signup,getUsers,getuser,updateuser, forgotPassword}=require('../controllers/user.controller');
const auth=require('../middelwares/athentications');
//user routes
router.get('/user',auth,getUsers);
router.get('/user/:id',auth,getuser);
router.put('/user/:id',auth,updateuser);
//auth routes
router.post('/signin',signin);
router.post('/signup',signup);
router.post('/forgot-password', forgotPassword);
module.exports=router;
 