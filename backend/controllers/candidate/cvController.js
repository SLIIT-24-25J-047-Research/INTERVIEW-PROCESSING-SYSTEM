const CandidateCV = require('../../models/candidate/CandidateCV');
const path = require('path');
const fs = require('fs');

// Upload CV
const uploadCV = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const { fullName, email } = req.body;
        const cvFilePath = `/uploads/${req.file.filename}`;

        const newCV = new CandidateCV({ fullName, email, cvFilePath });
        await newCV.save();

        res.status(201).json({ message: 'CV uploaded successfully', cv: newCV });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all CVs
const getAllCVs = async (req, res) => {
    try {
        const cvs = await CandidateCV.find();
        res.status(200).json(cvs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete CV by ID
const deleteCV = async (req, res) => {
    try {
        const { id } = req.params;
        const cv = await CandidateCV.findById(id);
        if (!cv) return res.status(404).json({ message: 'CV not found' });

        // Delete file from the server
        const filePath = path.join(__dirname, '../../uploads', path.basename(cv.cvFilePath));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        await CandidateCV.findByIdAndDelete(id);
        res.status(200).json({ message: 'CV deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { uploadCV, getAllCVs, deleteCV };
