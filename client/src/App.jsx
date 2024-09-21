import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Contacts from './pages/Contacts';
import SentMessages from './pages/SentMessages';
import Sidebar from './components/Sidebar';
import ContactDetails from './pages/ContactDetails';
import { useLocation } from 'react-router-dom';

// Component for handling protected routes
const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/" />;
};

// Main App component
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// Content of the App
const AppContent = () => {
  const location = useLocation(); 

  // Determine if the user is on login or register pages
  const hideSidebar = location.pathname === '/' || location.pathname === '/register';

  return (
    <div className="flex flex-col h-screen bg-white text-gray-100 w-full">
      <Navbar />
      <div className={`h-screen flex flex-1 overflow-hidden no-scrollbar`}>
        {/* Render the Sidebar only if not on login or register pages */}
        {!hideSidebar && <Sidebar />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protect these routes */}
          <Route path="/contacts" element={<PrivateRoute element={<Contacts />} />} />
          <Route path="/contact/:id" element={<PrivateRoute element={<ContactDetails />} />} />
          <Route path="/sent-messages" element={<PrivateRoute element={<SentMessages />} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
