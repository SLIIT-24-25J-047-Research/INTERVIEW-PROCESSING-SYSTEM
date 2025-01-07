// controllers/notificationController.js
const Notification = require('../../models/candidate/Notification');

const createNotification = async (req, res) => {
  try {
    const { userId, message, interviewType } = req.body;

    const newNotification = new Notification({ userId, message, interviewType });
    await newNotification.save();

    res.status(201).json({ message: 'Notification created successfully', notification: newNotification });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};

const getUserNotificationCount = async (req, res) => {
  try {
    const { userId } = req.params;
    const unreadCount = await Notification.countDocuments({ userId, status: 'unread' });
    res.status(200).json({ count: unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notification count', error });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { status: 'read' },
      { new: true }
    );

    res.status(200).json({ message: 'Notification marked as read', notification: updatedNotification });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error });
  }
};

module.exports = { createNotification, getUserNotifications, markAsRead, getUserNotificationCount };
