const router=require('express').Router();
const {signin,signup,getUsers,getuser, forgotPassword}=require('../controllers/user.controller');
const auth=require('../middelwares/athentications');
//user routes
router.get('/users',auth,getUsers);
router.get('/users/:id',auth,getuser);
//auth routes
router.post('/signin',signin);
router.post('/signup',signup);
router.post('/forgot-password', forgotPassword);
module.exports=router;
