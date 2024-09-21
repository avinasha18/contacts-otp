import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { api } from '../api/api';
import UploadContacts from '../components/UploadContacts'; // Import the new component

const Contacts = () => {
  const { isDarkMode } = useTheme();
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // For skeleton loader
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [newContact, setNewContact] = useState({ firstName: '', lastName: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false); // For button state
  const contactsPerPage = 10;
  const [openUploadModal, setOpenUploadModal] = useState(false); // Modal state for file upload

  useEffect(() => {
    fetchContacts();
  }, [page, searchTerm]);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${api}/api/contacts?page=${page}&limit=${contactsPerPage}&search=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(response.data.contacts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
    setIsLoading(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event) => {
    setPage(Number(event.target.value));
  };

  const handleNewContactChange = (event) => {
    const { name, value } = event.target;
    if (name === 'phone') {
      const formattedPhone = value.replace(/[^0-9]/g, '');
      if (formattedPhone.length <= 10) {
        setNewContact({ ...newContact, phone: formattedPhone });
      }
    } else {
      setNewContact({ ...newContact, [name]: value });
    }
  };

  const handleCreateNewContact = async () => {
    if (newContact.phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    setIsSubmitting(true); // Disable button while submitting
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${api}/api/contacts`, newContact, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpenNewContactModal(false);
      setNewContact({ firstName: '', lastName: '', phone: '', email: '' });
      fetchContacts();
    } catch (error) {
      console.error('Error creating new contact:', error);
    }
    setIsSubmitting(false); // Re-enable button after submission
  };

  const skeletonLoader = Array.from({ length: 5 }).map((_, index) => (
    <div key={index} className="mb-2 p-4 rounded shadow bg-gray-300 animate-pulse">
      <div className="h-4 bg-gray-400 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-400 rounded w-2/3"></div>
    </div>
  ));

  return (
    <div className={`mx-auto p-6 w-full ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800 w-full'}`}>
      <h1 className="text-3xl font-bold mb-6">Contacts</h1>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search contacts"
          value={searchTerm}
          onChange={handleSearch}
          className={`w-2/3 p-2 rounded border ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <div>
          <button
            onClick={() => setOpenNewContactModal(true)}
            className={`ml-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 ${isSubmitting && 'opacity-50 cursor-not-allowed'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add New Contact'}
          </button>
          <button
            onClick={() => setOpenUploadModal(true)}
            className="ml-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200"
          >
            Upload JSON
          </button>
        </div>
      
      </div>

      {isLoading ? skeletonLoader : (
        <ul>
          {contacts.map((contact) => (
            <li key={contact._id} className={`mb-2 p-4 rounded shadow ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} transition-transform transform hover:scale-105`}>
              <Link to={`/contact/${contact._id}`} className="block">
                <h2 className="text-lg font-semibold">{`${contact.firstName} ${contact.lastName}`}</h2>
                <p className="text-gray-500">{contact.phone}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            value={index + 1}
            onClick={handlePageChange}
            className={`mx-1 px-3 py-1 rounded ${page === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'} hover:bg-blue-500 transition duration-200`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {openUploadModal && <UploadContacts onClose={() => setOpenUploadModal(false)} fetchContacts={fetchContacts} />}

      {openNewContactModal && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${isDarkMode ? 'bg-black bg-opacity-70' : 'bg-gray-300 bg-opacity-70'}`}>
          <div className={`bg-white rounded-lg p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
            <h2 className="text-xl font-bold mb-4">Create New Contact</h2>
            {['firstName', 'lastName', 'phone', 'email'].map((field) => (
              <input
                key={field}
                name={field}
                type={field === 'phone' ? 'tel' : field === 'email' ? 'email' : 'text'}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={newContact[field]} 
                onChange={handleNewContactChange}
                className={`mb-4 w-full p-2 rounded border ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            ))}
            <div className="flex justify-end">
              <button onClick={() => setOpenNewContactModal(false)} className="mr-2 py-2 px-4 rounded border border-gray-400 hover:bg-gray-200">Cancel</button>
              <button onClick={handleCreateNewContact} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
