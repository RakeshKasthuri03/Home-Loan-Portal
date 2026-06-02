const router = require('express').Router();
const auth=require('../middelwares/athentications');
const {adminsignup}=require('../controllers/admin.controller');

router.post('/signup',adminsignup);

module.exports=router;