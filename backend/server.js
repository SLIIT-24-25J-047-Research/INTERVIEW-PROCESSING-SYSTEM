require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');


// Middleware
app.use(express.json());
app.use(cors());

// const { data } = await drive.files.get({ fileId: 'YOUR_FILE_ID', alt: 'media' }, { responseType: 'stream' });
// data.pipe(fs.createWriteStream('Questiondataset.csv')); 


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/employer/JobsRoutes')); 
app.use('/api/questions', require('./routes/employer/questionRoutes')); 
app.use('/api/skillGroups', require('./routes/employer/skillGroupRoutes')); 
app.use('/api/classification', require('./routes/candidate/predictionRoutes'));
app.use('/api/non-t-interviews', require('./routes/employer/NonTechInterviewRoutes'));
app.use('/api/t-interviews', require('./routes/employer/TechInterviewRoutes'));
app.use('/api/notifications', require('./routes/candidate/NotificationRoutes'));
app.use('/api/savejobs', require('./routes/candidate/SavedJobRoutes'));
app.use('/api/CVfiles', require('./routes/candidate/CVRoutes'));
app.use('/api/cv-skills', require('./routes/candidate/CVSkillsRoutes'));
app.use('/api/techQuestions', require('./routes/employer/TechnicalQuestionRoutes'));
app.use('/api/techAnswers', require('./routes/employer/TechnicalAnswersRoutes'));
app.use('/api/techCodeExecution', require('./routes/employer/TechnicalCodeExecutionRoute'));
app.use('/uploads', express.static('uploads'));
app.use('/api/feedback', require('./routes/candidate/FeedbackRoutes'));
app.use('/api/user-job-applications', require('./routes/candidate/UserHasJobApplicationRoutes'));
app.use('/api/results', require('./routes/employer/TechnicalSubmissionResultRoutes'));


// voice confidence routes
app.use('/api', require('./routes/voiceConfidenceRoutes'));
app.use('/api/audio', require('./routes/audioRoutes'));

// image classification routes
app.use('/api', require('./routes/candidate/predictionRoutes'));

// mockup results routes
app.use('/api/candidate-result', require('./routes/candidate/candidateResultRoutes'));

// total pre evaluation routes
app.use('/api/pre-evaluation', require('./routes/candidate/preEvaluationScoreRoutes'));



//code complexity routes

app.use('/api/candidateScores', require('./routes/candidate/CodeComplexityScoreRoutes'));
app.use('/api/calculations', require('./routes/candidate/CodeCalculationRoutes'));
app.use('/api/CodeSubmissions', require('./routes/candidate/CodeSubmissionRoutes'));


//test
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: "Node.js backend is running" });
});


// stress routes

app.use('/api/stress',  require('./routes/stressRoutes'));


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected Successfully'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server up & running on port: ${PORT}`));
