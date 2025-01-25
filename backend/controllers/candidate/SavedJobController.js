const SavedJob = require('../../models/candidate/SavedJob');

const savedJobController = {
    // Save a job
    saveJob: async (req, res) => {
        try {
            const { userId, jobId } = req.body;

            const savedJob = new SavedJob({
                userId,
                jobId
            });

            await savedJob.save();
            res.status(200).json({ message: 'Job saved successfully' });
        } catch (error) {
            if (error.code === 11000) { 
                return res.status(409).json({ message: 'Job already saved' });
            }
            res.status(500).json({ message: 'Error saving job', error: error.message });
        }
    },

getSavedJobs: async (req, res) => {
    try {
        const { userId } = req.params;
        const savedJobs = await SavedJob.find({ userId }).sort({ savedAt: -1 });

        res.status(200).json(savedJobs); // Returns saved jobs with jobId as ObjectIDs
    } catch (error) {
        console.error('Error fetching saved jobs:', error);
        res.status(500).json({ message: 'Error fetching saved jobs', error: error.message });
    }
},


    // Remove a saved job
    removeSavedJob: async (req, res) => {
        try {
            const { userId, jobId } = req.params;
            await SavedJob.findOneAndDelete({ userId, jobId });
            res.status(200).json({ message: 'Job removed from saved jobs' });
        } catch (error) {
            res.status(500).json({ message: 'Error removing saved job', error: error.message });
        }
    }
};

module.exports = savedJobController;