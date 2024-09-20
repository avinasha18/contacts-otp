import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext'; // Import ThemeContext for theme toggle
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { api } from '../api/api';
const ContactDetails = () => {
  const { id } = useParams();
  const { isDarkMode } = useTheme(); // Access dark mode status from ThemeContext
  const [contact, setContact] = useState(null);
  const [message, setMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [sendingStatus, setSendingStatus] = useState('');

  useEffect(() => {
    fetchContactDetails();
  }, [id]);

  const fetchContactDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${api}/api/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContact(response.data);
      setMessage(`Hi ${response.data.firstName}. Your OTP is: ${generateOTP()}`);
    } catch (error) {
      console.error('Error fetching contact details:', error);
    }
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendMessage = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${api}/api/contacts/send-otp`,
        { contactId: id, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSendingStatus('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      setSendingStatus(`Failed to send message: ${error.response?.data?.message || 'Unknown error'}`);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSendingStatus('');
  };

  if (!contact) return <div className="text-center text-lg font-bold">Loading...</div>;

  return (
    <div className={`w-full min-h-screen flex flex-col items-center py-8 px-4 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className={`${isDarkMode ? 'bg-black' : 'bg-white'} w-full max-w-lg  rounded-lg shadow-lg p-6`}>
        <h1 className="text-3xl font-bold mb-4">{contact.firstName} {contact.lastName}</h1>
        <p className="mb-2"><span className="font-semibold">Phone:</span> {contact.phone}</p>
        <p className="mb-4"><span className="font-semibold">Email:</span> {contact.email}</p>

        <textarea
          className={`w-full p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} mb-4`}
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-3 rounded-lg text-lg font-semibold ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-400 text-white'} transition-colors`}
          onClick={handleSendMessage}
        >
          Send Message
        </motion.button>
      </div>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>Message Status</DialogTitle>
        <DialogContent className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <p>{sendingStatus}</p>
        </DialogContent>
        <DialogActions className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <button
            className={`px-4 py-2 rounded-md ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'} hover:opacity-90`}
            onClick={handleCloseModal}
          >
            Close
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ContactDetails;
