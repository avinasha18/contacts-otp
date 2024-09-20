import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext'; // Adjust the path as necessary
import { api } from '../api/api';

const SentMessages = () => {
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const messagesPerPage = 10;

  useEffect(() => {
    fetchSentMessages();
  }, [page]);

  const fetchSentMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${api}/api/messages?page=${page}&limit=${messagesPerPage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(response.data.messages);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching sent messages:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div
      className={`w-full min-h-screen p-6 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
      }`}
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Sent Messages</h1>
        <ul>
          {messages.map((message) => (
            <li
              key={message._id}
              className={`mb-4 p-4 rounded shadow ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h2 className="text-xl font-semibold mb-2">
                To: {message.recipient.firstName} {message.recipient.lastName}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(message.sentAt).toLocaleString()}
              </p>
              <p className="text-base">{message.content}</p>
            </li>
          ))}
        </ul>
        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className={`px-4 py-2 mx-1 rounded ${
              page === 1
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-1 rounded ${
                page === index + 1
                  ? 'bg-blue-800 text-white'
                  : isDarkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className={`px-4 py-2 mx-1 rounded ${
              page === totalPages
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SentMessages;
