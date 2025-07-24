// src/controllers/notificationController.js
import Notification from '../models/notificationModel.js';

// Send a notification to a user
export const sendNotification = async (req, res) => {
  try {
    const { userId, title, message } = req.body;
    const notification = new Notification({ userId, title, message });
    await notification.save();
    res.status(201).json({ success: true, message: 'Notification sent', notification });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send notification', error: error.message });
  }
};

// Get all notifications for a user
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching notifications', error: error.message });
  }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.status(200).json({ success: true, message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating notification', error: error.message });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete notification', error: error.message });
  }
};
