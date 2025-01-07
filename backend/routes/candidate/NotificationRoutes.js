
const express = require('express');
const { createNotification, getUserNotifications, markAsRead, getUserNotificationCount } = require('../../controllers/candidate/NotificationController');

const router = express.Router();


router.post('/create', createNotification);
router.get('/:userId', getUserNotifications);
router.get('/:userId/count', getUserNotificationCount);
router.patch('/read/:notificationId', markAsRead);

module.exports = router;
