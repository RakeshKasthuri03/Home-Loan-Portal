const route=require('express').Router();
const {agentsignup,agentsignin,getagentbyid,getagents,updateagent,deleteagent}=require('../controllers/agent.controller');
const auth=require('../middelwares/athentications');



route.get('/',auth,getagents);
route.get('/:id',auth,getagentbyid);
route.put('/:id',auth,updateagent);
route.delete('/:id',auth,deleteagent);


//agent credentials routes
route.post('/signup',agentsignup);
route.post('/signin',agentsignin);


module.exports=route;