import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Contacts from './pages/Contacts';
import SentMessages from './pages/SentMessages';
import Sidebar from './components/Sidebar';
import ContactDetails from './pages/ContactDetails';

function App() {
  return (
    <Router>
       <div className="flex flex-col h-screen bg-white text-gray-100 w-full">
      <Navbar  />
      <div className={`h-screen flex flex-1 overflow-hidden no-scrollbar`}>
        <Sidebar />
        <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Contacts />} />
              <Route path="/contact/:id" element={<ContactDetails />} />
              <Route path="/sent-messages" element={<SentMessages />} />
            </Routes>
          </div>
        </div>
     
    </Router>
  );
}

export default App;
