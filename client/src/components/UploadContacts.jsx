import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { api } from '../api/api';

const UploadContacts = ({ onClose, fetchContacts }) => {
  const { isDarkMode } = useTheme();
  const [jsonData, setJsonData] = useState('');
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleTextAreaChange = (event) => {
    setJsonData(event.target.value);
  };

  const handleFileUpload = async () => {
    setIsSubmitting(true);
    const contacts = [];

    try {
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const parsedData = JSON.parse(e.target.result);
            contacts.push(...parsedData);
            await submitContacts(contacts);
          } catch (error) {
            setErrors(['Invalid JSON format in file']);
          }
        };
        reader.readAsText(file);
      } else if (jsonData) {
        try {
          const parsedData = JSON.parse(jsonData);
          contacts.push(...parsedData);
          await submitContacts(contacts);
        } catch (error) {
          setErrors(['Invalid JSON format in text area']);
        }
      }
    } catch (error) {
      console.error('Error uploading contacts:', error);
      setErrors(['An error occurred while processing the file.']);
    }
    setIsSubmitting(false);
  };

  const submitContacts = async (contacts) => {
    const validContacts = [];
    const errorMessages = [];

    contacts.forEach((contact, index) => {
      if (
        contact.firstName &&
        contact.lastName &&
        contact.phone &&
        contact.email &&
        contact.phone.length === 10 &&
        /^[0-9]+$/.test(contact.phone)
      ) {
        validContacts.push(contact);
      } else {
        errorMessages.push(`Invalid data at index ${index + 1}`);
      }
    });

    if (validContacts.length > 0) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${api}/api/contacts/bulk`, validContacts, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchContacts();
        onClose(); // Close the modal
      } catch (error) {
        console.error('Error adding contacts:', error);
        setErrors(['Error adding valid contacts. Please try again later.']);
      }
    }
    setErrors(errorMessages);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${isDarkMode ? 'bg-black bg-opacity-70' : 'bg-gray-300 bg-opacity-70'}`}>
      <div className={`bg-white rounded-lg p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
        <h2 className="text-xl font-bold mb-4">Upload or Paste JSON Contacts</h2>

        <div className="mb-4">
          <label className="block mb-2">Upload JSON File:</label>
          <input type="file" accept=".json" onChange={handleFileChange} className="mb-4" />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Or Paste JSON Data:</label>
          <textarea
            value={jsonData}
            onChange={handleTextAreaChange}
            className={`w-full h-32 p-2 rounded border ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder='Paste JSON data here...'
          />
        </div>

        {errors.length > 0 && (
          <div className="mb-4 text-red-500">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 py-2 px-4 rounded border border-gray-400 hover:bg-gray-200">Cancel</button>
          <button
            onClick={handleFileUpload}
            className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 ${isSubmitting && 'opacity-50 cursor-not-allowed'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadContacts;
