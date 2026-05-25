const path = require('path');
const fs = require('fs');
const multer = require('multer');
const User = require('../models/user.model');

// ensure uploads dir exists
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_/]/g, '_');
    cb(null, safe);
  }
});

const upload = multer({ storage });

// POST /api/upload
// Accepts form-data: file (single), userId (optional), purpose: 'profile'|'document' (optional), docName/docType
const handleUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const filename = req.file.filename;
    const url = `${req.protocol}://${req.get('host')}/uploads/${filename}`;

    const { userId, purpose, docName, docType } = req.body || {};

    // If userId provided and purpose specified, update user document accordingly
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        if (purpose === 'profile') {
          user.profilePhoto = url;
          await user.save();
          return res.status(200).json({ message: 'Profile photo uploaded', url, user });
        }

        // default to adding to documents
        const docEntry = {
          name: docName || req.file.originalname,
          url,
          type: docType || req.file.mimetype,
        };
        user.documents = user.documents || [];
        user.documents.push(docEntry);
        await user.save();
        return res.status(200).json({ message: 'Document uploaded', doc: docEntry, user });
      }
    }

    // If no user update required, return file info
    return res.status(200).json({ message: 'File uploaded', file: { url, filename, originalname: req.file.originalname } });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Upload failed' });
  }
};

module.exports = { upload, handleUpload };
