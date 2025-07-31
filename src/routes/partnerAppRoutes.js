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
} from '../controllers/partnerAppController.js';
import { protectPartner } from '../middleware/partnerAuth.js';

const router = express.Router();

router.post('/register', registerPartner);
router.post('/login', loginPartner);
router.get('/profile', protectPartner, getProfile);
router.put('/profile/update', protectPartner, updateProfile);
router.patch('/availability', protectPartner, toggleAvailability);

router.get('/menu', protectPartner, getMenu);
router.post('/menu/add', protectPartner, addMenuItem);
router.put('/menu/edit/:itemId', protectPartner, editMenuItem);
router.delete('/menu/delete/:itemId', protectPartner, deleteMenuItem);

router.get('/orders/active', protectPartner, getActiveOrders);
router.patch('/orders/:orderId/status', protectPartner, updateOrderStatus);
router.get('/orders/history', protectPartner, getOrderHistory);

router.get('/wallet', protectPartner, getWallet);
router.post('/payout/request', protectPartner, requestPayout);

export default router;
