const router = require('express').Router();
const { upload, handleUpload, getFile, deleteFile } = require('../controllers/upload.controller');

// ✅ Upload
router.post('/upload', upload.single('file'), handleUpload);

// ✅ Get file
router.get('/file/:filename', getFile);

// ✅ Delete file (optional)
router.delete('/file/:filename', deleteFile);

module.exports = router;
