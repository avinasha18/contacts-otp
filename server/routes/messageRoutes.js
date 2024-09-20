import express from 'express';
import { getSentMessages } from '../controllers/messageController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getSentMessages);

export default router;