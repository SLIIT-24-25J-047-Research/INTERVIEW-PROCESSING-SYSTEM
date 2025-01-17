const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const UserCV = require('../../models/candidate/CVSubmission');
const User = require('../../models/User');
const Job = require('../../models/employer/JobsModel');

const uploadCV = async (req, res) => {
  try {
    const { fullName, email, userId, jobId } = req.body; 
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }


    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User ID is not valid' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(400).json({ message: 'Job ID is not valid' });
    }

    // Get GridFS bucket
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'uploads',
    });

    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}-${file.originalname}`;

    // Upload file to GridFS
    const uploadStream = bucket.openUploadStream(uniqueFilename, {
      contentType: file.mimetype,
    });

    // Convert buffer to stream and pipe to GridFS
    const bufferStream = require('stream').Readable.from(file.buffer);
    await new Promise((resolve, reject) => {
      bufferStream
        .pipe(uploadStream)
        .on('error', reject)
        .on('finish', resolve);
    });

    // Save metadata to MongoDB
    const newUserCV = new UserCV({
      fullName,
      email,
      userId, 
      jobId,
      fileId: uploadStream.id, 
    });

    await newUserCV.save();

    res.status(200).json({
      message: 'CV uploaded successfully',
      fileId: uploadStream.id.toString(),
    });

  } catch (error) {
    console.error('Error uploading CV:', error);
    res.status(500).json({
      message: 'Error uploading CV',
      error: error.message,
    });
  }
};

// get
const getCV = async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.id);
    
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'uploads'
    });

    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files.length) {
      return res.status(404).json({ message: 'File not found' });
    }

    const file = files[0];
    res.set('Content-Type', file.contentType);
    res.set('Content-Disposition', `attachment; filename="${file.filename}"`);

    bucket.openDownloadStream(fileId).pipe(res);

  } catch (error) {
    console.error('Error retrieving CV:', error);
    res.status(500).json({ 
      message: 'Error retrieving CV', 
      error: error.message 
    });
  }
};

const getCVMetrics = async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.id);

    
    console.log(`Fetching metadata for fileId: ${fileId}`);

    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });

    const files = await bucket.find({ _id: fileId }).toArray();
    console.log('Found files:', files);

    if (!files.length) {
      return res.status(404).json({ message: 'File not found' });
    }

    const file = files[0];
    res.status(200).json({
      filename: file.filename,
      contentType: file.contentType,
      length: file.length,
      uploadDate: file.uploadDate,
      metadata: file.metadata || 'No metadata available',
    });

  } catch (error) {
    console.error('Error retrieving CV metadata:', error);
    res.status(500).json({
      message: 'Error retrieving CV metadata',
      error: error.message,
    });
  }
};





const getCVByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find all CVs for the user
    const userCVs = await UserCV.find({ userId: userId }).populate('fileId');
    const cvCount = userCVs.length; // Total number of CVs

    if (userCVs.length === 0) {
      return res.status(404).json({ message: 'No CVs found for this user' });
    }

    // Map the CV data to include relevant details for each CV
    const cvData = userCVs.map(cv => ({
      fullName: cv.fullName,
      email: cv.email,
      jobId: cv.jobId,
      uploadDate: cv.uploadDate,
      fileId: cv.fileId?._id.toString(), 
      filename: cv.fileId?.filename,    
      fileSize: cv.fileId?.length,
    }));

    // Return the response
    res.status(200).json({
      message: 'CV data retrieved successfully',
      cvData,
      cvCount,
    });

  } catch (error) {
    console.error('Error retrieving CVs:', error);
    res.status(500).json({
      message: 'Error retrieving CVs',
      error: error.message,
    });
  }
};




// Update CV Submission
const updateCV = async (req, res) => {
  try {
    const { cvId } = req.params; 
    const { fullName, email,userId, jobId } = req.body; 
    const file = req.file;


    if (!userId || !jobId) {
      return res.status(400).json({ message: 'User ID and Job ID are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User ID is not valid' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(400).json({ message: 'Job ID is not valid' });
    }

    const existingCV = await UserCV.findById(cvId);
    if (!existingCV) {
      return res.status(404).json({ message: 'CV submission not found' });
    }

   
    let fileId = existingCV.fileId; 
    if (file) {
      
      const db = mongoose.connection.db;
      const bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: 'uploads',
      });

 
      await bucket.delete(existingCV.fileId);
      const timestamp = Date.now();
      const uniqueFilename = `${timestamp}-${file.originalname}`;

      const uploadStream = bucket.openUploadStream(uniqueFilename, {
        contentType: file.mimetype,
      });

      const bufferStream = require('stream').Readable.from(file.buffer);
      await new Promise((resolve, reject) => {
        bufferStream
          .pipe(uploadStream)
          .on('error', reject)
          .on('finish', resolve);
      });

      // Update fileId with the new file's ID
      fileId = uploadStream.id;
    }

    // Update the CV metadata 
    existingCV.fullName = fullName || existingCV.fullName;
    existingCV.email = email || existingCV.email;
    existingCV.jobId = jobId || existingCV.jobId;
    existingCV.fileId = fileId;

    await existingCV.save();

    res.status(200).json({
      message: 'CV updated successfully',
      fileId: fileId.toString(),
    });

  } catch (error) {
    console.error('Error updating CV:', error);
    res.status(500).json({
      message: 'Error updating CV',
      error: error.message,
    });
  }
};


// Delete 
const deleteCV = async (req, res) => {
  try {
    const { cvId } = req.params; 

 
    const existingCV = await UserCV.findById(cvId);
    if (!existingCV) {
      return res.status(404).json({ message: 'CV submission not found' });
    }

    // Get GridFS bucket to remove the file
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'uploads',
    });

    // Delete the CV file from GridFS
    await bucket.delete(existingCV.fileId);

    // Remove the CV metadata from MongoDB
    await existingCV.remove();

    res.status(200).json({ message: 'CV deleted successfully' });

  } catch (error) {
    console.error('Error deleting CV:', error);
    res.status(500).json({
      message: 'Error deleting CV',
      error: error.message,
    });
  }
};

module.exports = { uploadCV, getCV, updateCV, deleteCV, getCVMetrics, getCVByUserId };