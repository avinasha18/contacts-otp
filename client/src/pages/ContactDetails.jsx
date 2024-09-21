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
  const [isSending, setIsSending] = useState(false); // State to track sending status

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
    setIsSending(true); // Set sending state to true when the process starts
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${api}/api/contacts/send-otp`, { contactId: id, message }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Show success message
      setSendingStatus('Message sent successfully!');
      setIsSending(false); // Reset sending state
    } catch (error) {
      const backendMessage = error.response?.data?.message || 'Unknown error occurred';
  
      // Handle specific Twilio error message related to unverified numbers
      if (backendMessage.includes('unverified number')) {
        setSendingStatus(
          'Sorry, the phone number is not verified by Twilio. We are using a free version, so please verify the number on Twilio before proceeding.'
        );
      } else {
        // Handle other generic errors
        setSendingStatus(`Failed to send message: ${backendMessage}`);
      }
      setIsSending(false); // Reset sending state
    }
    
    // Open a modal to show the result
    setOpenModal(true);
  };
  
  const handleCloseModal = () => {
    setOpenModal(false);
    setSendingStatus('');
  };

  // Skeleton loader for contact card
  const renderSkeleton = () => (
    <div className="animate-pulse w-full max-w-lg rounded-lg shadow-lg p-6">
      <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
      <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-32 bg-gray-300 rounded mb-4"></div>
      <div className="h-12 bg-blue-300 rounded-lg"></div>
    </div>
  );

  if (!contact) {
    return (
      <div className={`w-full min-h-screen flex flex-col items-center py-8 px-4 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'}`}>
        {renderSkeleton()}
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen flex flex-col items-center py-8 px-4 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className={`${isDarkMode ? 'bg-black' : 'bg-white'} w-full max-w-lg rounded-lg shadow-lg p-6`}>
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
          whileHover={{ scale: isSending ? 1 : 1.05 }}
          whileTap={{ scale: isSending ? 1 : 0.95 }}
          className={`w-full py-3 rounded-lg text-lg font-semibold ${isSending ? 'bg-gray-500 cursor-not-allowed' : (isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-400 text-white')} transition-colors`}
          onClick={handleSendMessage}
          disabled={isSending} // Disable button while sending
        >
          {isSending ? 'Sending...' : 'Send Message'}
        </motion.button>
      </div>

      {/* Error or Success Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          Message Status
        </DialogTitle>
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
