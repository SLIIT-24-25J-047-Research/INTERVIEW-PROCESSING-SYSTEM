
const express = require('express');
const { scheduleInterview, editInterview, cancelInterview, getAllSchedules, getScheduleById, getSchedulesByUserId,updateInterviewStatus, getSchedulesByUserIdAndJobId } = require('../../controllers/employer/NonTechInterviewController');
const router = express.Router();


router.post('/schedule', scheduleInterview);
router.put('/schedule/edit/:id', editInterview);
router.put('/update-status/:id', updateInterviewStatus);
router.delete('/cancel/:id', cancelInterview);
router.get('/schedule/get', getAllSchedules);
router.get('/schedule/get/:id', getScheduleById);
router.get('/schedule/user/:userId', getSchedulesByUserId);
router.get('/schedule/user/:userId/job/:jobId', getSchedulesByUserIdAndJobId);

module.exports = router;
