const route=require('express').Router();
const {agentsignup,agentsignin,getagentbyid,getagents,getAgentStats,updateagent,deleteagent,getAgentApplications, startReview, requestDocuments, addRemarks, recommendApplication, verifyDocument}=require('../controllers/agent.controller');
const auth=require('../middelwares/athentications');
const {isAgent}=require('../middelwares/roles');
 

// ✅ specific routes FIRST
route.get('/applications', auth, isAgent, getAgentApplications);
route.post('/signup', agentsignup);
route.get('/stats', auth, isAgent, getAgentStats);
route.put('/review/:applicationId', auth, isAgent, startReview);
route.put('/request-docs/:applicationId', auth, isAgent, requestDocuments);
route.post('/remarks/:applicationId', auth, isAgent, addRemarks);
route.put('/recommend/:applicationId', auth, isAgent, recommendApplication);
route.put('/verify-doc/:applicationId', auth, isAgent, verifyDocument);

// ✅ credentials
route.post('/signin', agentsignin);

// ✅ generic routes LAST
route.get('/', auth, getagents);
route.get('/:id', auth, getagentbyid);  
route.patch('/:id', auth, updateagent);
route.delete('/:id', auth, deleteagent);

module.exports=route;