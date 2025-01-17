const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const UserCV = require('../../models/candidate/CVSubmission');

const uploadCV = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get GridFS bucket
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'uploads'
    });

    // Create a unique filename
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}-${file.originalname}`;

    // Upload file to GridFS
    const uploadStream = bucket.openUploadStream(uniqueFilename, {
      contentType: file.mimetype
    });

    // Convert buffer to stream and pipe to GridFS
    const bufferStream = require('stream').Readable.from(file.buffer);
    await new Promise((resolve, reject) => {
      bufferStream.pipe(uploadStream)
        .on('error', reject)
        .on('finish', resolve);
    });

    // Save metadata to MongoDB
    const newUserCV = new UserCV({
      fullName,
      email,
      fileId: uploadStream.id // This is the ObjectId of the uploaded file
    });

    await newUserCV.save();

    res.status(200).json({ 
      message: 'CV uploaded successfully', 
      fileId: uploadStream.id.toString()
    });

  } catch (error) {
    console.error('Error uploading CV:', error);
    res.status(500).json({ 
      message: 'Error uploading CV', 
      error: error.message 
    });
  }
};

// Add a function to retrieve files (useful for downloading later)
const getCV = async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.id);
    
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'uploads'
    });

    // Get file info
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files.length) {
      return res.status(404).json({ message: 'File not found' });
    }

    const file = files[0];
    res.set('Content-Type', file.contentType);
    res.set('Content-Disposition', `attachment; filename="${file.filename}"`);

    // Stream file to response
    bucket.openDownloadStream(fileId).pipe(res);

  } catch (error) {
    console.error('Error retrieving CV:', error);
    res.status(500).json({ 
      message: 'Error retrieving CV', 
      error: error.message 
    });
  }
};

module.exports = { uploadCV, getCV };