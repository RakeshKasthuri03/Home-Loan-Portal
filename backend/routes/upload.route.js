const router = require('express').Router();
const { upload, handleUpload } = require('../controllers/upload.controller');

// single file field name: 'file'
router.post('/upload', upload.single('file'), handleUpload);

module.exports = router;
