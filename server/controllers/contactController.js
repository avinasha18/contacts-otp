import Contact from '../models/ContactModel.js';
import Message from '../models/OTP.js';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const getContacts = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { firstName: 1, lastName: 1 },
  };

  try {
    const query = {
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ],
    };

    const result = await Contact.paginate(query, options);
    res.json({
      contacts: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error: error.message });
  }
};

export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact', error: error.message });
  }
};

export const sendOTP = async (req, res) => {
  const { contactId, message } = req.body;

  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: contact.phone,
    });

    const newMessage = new Message({
      recipient: contactId,
      content: message,
      sentAt: new Date(),
    });
    await newMessage.save();

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};

export const createContact = async (req, res) => {
  const { firstName, lastName, phone, email } = req.body;

  try {
    // Check if the phone number starts with '+'
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    const newContact = new Contact({
      firstName,
      lastName,
      phone: formattedPhone,
      email,
    });

    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: 'Error creating contact', error: error.message });
  }
};