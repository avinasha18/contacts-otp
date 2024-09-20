import express from 'express';
import { getContacts, getContactById, sendOTP, createContact } from '../controllers/contactController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getContacts);
router.get('/:id', auth, getContactById);
router.post('/', auth, createContact);

router.post('/send-otp', auth, sendOTP);

export default router;