const ImageClassification = require('../../models/candidate/imageClassification');

// Function to store classification result
const storePrediction = async (email, prediction) => {
    try {
        const newClassification = new ImageClassification({
            email: email,
            prediction: prediction, 
        });
        await newClassification.save();
        return { success: true, message: 'Prediction saved successfully' };
    } catch (error) {
        console.error('Error saving prediction:', error);
        return { success: false, message: 'Error saving prediction' };
    }
};


module.exports = {
    storePrediction,
};
