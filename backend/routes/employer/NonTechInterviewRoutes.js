
const express = require('express');
const { scheduleInterview, editInterview, cancelInterview, getAllSchedules, getScheduleById, getSchedulesByUserId, } = require('../../controllers/employer/NonTechInterviewController');
const router = express.Router();


router.post('/schedule', scheduleInterview);
router.put('/schedule/edit/:id', editInterview);
router.delete('/cancel/:id', cancelInterview);
router.get('/schedule/get', getAllSchedules);
router.get('/schedule/get/:id', getScheduleById);
router.get('/shedule/user/:userId', getSchedulesByUserId);

module.exports = router;
