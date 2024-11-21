const CandidateScore = require('../../models/code_complexity/CandidateScoreModels');

// Create a new candidate score
exports.createCandidateScore = async (req, res) => {
    const { userId, questionId, wcc, cfc, cc } = req.body;

    try {
        const totalScore = wcc + cfc + cc; // Calculate total score
        const candidateScore = new CandidateScore({
            userId,
            questionId,
            wcc,
            cfc,
            cc,
            totalScore,
        });
        await candidateScore.save();
        res.status(201).json({ message: "Candidate score saved successfully", candidateScore });
    } catch (error) {
        res.status(500).json({ error: "Failed to save candidate score" });
    }
};

// Read (get) a specific candidate score
exports.getCandidateScore = async (req, res) => {
    const { id } = req.params;

    try {
        const candidateScore = await CandidateScore.findById(id).populate('userId').populate('questionId');
        if (!candidateScore) {
            return res.status(404).json({ error: "Candidate score not found" });
        }
        res.status(200).json(candidateScore);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch candidate score" });
    }
};

// Update a candidate score
exports.updateCandidateScore = async (req, res) => {
    const { id } = req.params;
    const { wcc, cfc, cc } = req.body;

    try {
        const totalScore = wcc + cfc + cc; // Recalculate total score
        const candidateScore = await CandidateScore.findByIdAndUpdate(
            id,
            { wcc, cfc, cc, totalScore },
            { new: true }
        );
        if (!candidateScore) {
            return res.status(404).json({ error: "Candidate score not found" });
        }
        res.status(200).json({ message: "Candidate score updated successfully", candidateScore });
    } catch (error) {
        res.status(500).json({ error: "Failed to update candidate score" });
    }
};

// Delete a candidate score
exports.deleteCandidateScore = async (req, res) => {
    const { id } = req.params;

    try {
        const candidateScore = await CandidateScore.findByIdAndDelete(id);
        if (!candidateScore) {
            return res.status(404).json({ error: "Candidate score not found" });
        }
        res.status(200).json({ message: "Candidate score deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete candidate score" });
    }
};

// List and sort all candidate scores
exports.listCandidateScores = async (req, res) => {
    const { sort = 'desc', userId, questionId } = req.query;

    try {
        const filter = {};
        if (userId) filter.userId = userId;
        if (questionId) filter.questionId = questionId;

        const sortOrder = sort === 'asc' ? 1 : -1; // Determine sort order
        const candidateScores = await CandidateScore.find(filter)
            .populate('userId')
            .populate('questionId')
            .sort({ totalScore: sortOrder });

        res.status(200).json(candidateScores);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch candidate scores" });
    }
};
