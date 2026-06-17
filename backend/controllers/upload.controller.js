const path = require('path');
const fs = require('fs');
const multer = require('multer');
const User = require('../models/user.model');
const Agent = require('../models/agent.model');

// ensure uploads dir exists
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

//  Allowed file types
const allowedTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Allow common image formats for uploads
const allowedImageTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp'
];


//  storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const safe =
      Date.now() +
      '-' +
      file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, safe);
  },
});


//  file filter (PDF, DOC, DOCX, and image files)
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype) || allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, and image files are allowed ❌'), false);
  }
};


// multer config
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // ✅ 10MB limit for documents and images
  }
});


//  POST /api/upload
const handleUpload = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: 'No file uploaded' });

    const filename = req.file.filename;
    const url = `${req.protocol}://${req.get('host')}/api/file/${filename}`;

    const { userId, purpose, docName, docType } = req.body || {};

    if (userId) {
      // Try User first
      const user = await User.findById(userId);
      if (user) {
        //  profile upload for user
        if (purpose === 'profile') {
          user.profilePhoto = url;
          await user.save();

          return res.status(200).json({
            message: 'Profile photo uploaded ✅',
            url,
            user,
          });
        }

        //  document upload for user
        const docEntry = {
          name: docName || req.file.originalname,
          url,
          type: docType || req.file.mimetype,
        };

        user.documents = user.documents || [];
        user.documents.push(docEntry);

        await user.save();

        return res.status(200).json({
          message: 'Document uploaded ✅',
          doc: docEntry,
          user,
        });
      }

      // If not a User, try Agent
      const agent = await Agent.findById(userId);
      if (agent) {
        if (purpose === 'profile') {
          agent.profilePhoto = url;
          await agent.save();
          return res.status(200).json({
            message: 'Agent profile photo uploaded ✅',
            url,
            agent,
          });
        }

        // Not handling agent documents for now
        return res.status(200).json({
          message: 'File uploaded for agent',
          file: { url, filename, originalname: req.file.originalname },
          agent,
        });
      }
    }

    //  general upload
    return res.status(200).json({
      message: 'File uploaded ✅',
      file: {
        url,
        filename,
        originalname: req.file.originalname,
      },
    });

  } catch (error) {
    console.error('Upload error:', error);

    //  handle file type error
    if (error.message.includes('Only PDF')) {
      return res.status(400).json({ message: error.message });
    }

    //  file size error
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large (Max 5MB) ❌' });
    }

    return res.status(500).json({ message: 'Upload failed ❌' });
  }
};



//  GET FILE (view/download)
const getFile = (req, res) => {
  try {
    const { filename } = req.params;

    const filePath = path.join(UPLOAD_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found ❌' });
    }

    res.sendFile(filePath);

  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ error: 'Failed to fetch file ❌' });
  }
};



//  DELETE FILE
const deleteFile = (req, res) => {
  try {
    const { filename } = req.params;

    const filePath = path.join(UPLOAD_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found ❌' });
    }

    fs.unlinkSync(filePath);

    res.json({ message: 'File deleted ✅' });

  } catch (error) {
    res.status(500).json({ error: 'Delete failed ❌' });
  }
};


module.exports = {
  upload,
  handleUpload,
  getFile,
  deleteFile,
};
   