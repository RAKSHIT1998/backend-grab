import express from 'express';
import { getSettings, updateSetting } from '../controllers/settingController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSettings);
router.post('/', protectAdmin, updateSetting);

export default router;
