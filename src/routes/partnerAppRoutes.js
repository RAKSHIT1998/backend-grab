import express from 'express';
import {
  registerPartner,
  loginPartner,
  getProfile,
  updateProfile,
  toggleAvailability,
  getMenu,
  addMenuItem,
  editMenuItem,
  deleteMenuItem,
  getActiveOrders,
  updateOrderStatus,
  getOrderHistory,
  getWallet,
  requestPayout,
  submitKyc,
  acceptOrder,
  rejectOrder,
  getOrder,
  assignRider,
  getNotifications,
  getRatings,
  replyRating,
} from '../controllers/partnerAppController.js';
import { protectPartner } from '../middleware/partnerAuth.js';

const router = express.Router();

router.post('/register', registerPartner);
router.post('/login', loginPartner);
router.get('/profile', protectPartner, getProfile);
router.put('/profile/update', protectPartner, updateProfile);
router.patch('/availability', protectPartner, toggleAvailability);
router.post('/availability', protectPartner, toggleAvailability);
router.post('/kyc', protectPartner, submitKyc);

router.get('/menu', protectPartner, getMenu);
router.post('/menu/add', protectPartner, addMenuItem);
router.put('/menu/edit/:itemId', protectPartner, editMenuItem);
router.delete('/menu/delete/:itemId', protectPartner, deleteMenuItem);

router.get('/orders/active', protectPartner, getActiveOrders);
router.post('/orders/accept', protectPartner, acceptOrder);
router.post('/orders/reject', protectPartner, rejectOrder);
router.get('/orders/:orderId', protectPartner, getOrder);
router.patch('/orders/:orderId/status', protectPartner, updateOrderStatus);
router.post('/orders/:orderId/status', protectPartner, updateOrderStatus);
router.post('/orders/:orderId/assign', protectPartner, assignRider);
router.get('/orders/history', protectPartner, getOrderHistory);

router.get('/wallet', protectPartner, getWallet);
router.post('/payout/request', protectPartner, requestPayout);
router.get('/notifications', protectPartner, getNotifications);
router.get('/ratings', protectPartner, getRatings);
router.post('/ratings/reply', protectPartner, replyRating);

export default router;
