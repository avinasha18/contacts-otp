import express from 'express';
import { getContacts, getContactById, sendOTP, createContact, createContacts } from '../controllers/contactController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getContacts);
router.get('/:id', auth, getContactById);
router.post('/', auth, createContact);
router.post('/api/contacts/bulk',auth, createContacts);

router.post('/send-otp', auth, sendOTP);

export default router;