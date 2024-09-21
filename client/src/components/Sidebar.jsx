import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaClipboardList, FaEnvelope } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { IconButton } from "@mui/material";

const Sidebar = () => {
  const { isDarkMode } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Toggle the sidebar collapse state
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav
      className={`hidden lg:block bg-${isDarkMode ? 'black' : 'white'} text-${
        isDarkMode ? 'gray-100' : 'gray-800'
      } ${isCollapsed ? "w-24" : "w-64"} transition-all duration-300 h-screen fixed lg:relative flex-shrink-0 p-3 shadow-md border-r ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}
    >
      <div className="flex justify-between items-center p-4">
        <h1 className={`${isCollapsed ? 'hidden' : 'font-bold text-xl'}`}>
          Contacts
        </h1>
        <IconButton
          onClick={toggleSidebar}
          className={`text-xl ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}
        >
          {isCollapsed ? '>' : '<'}
        </IconButton>
      </div>
      <ul className="mt-6">
       
        <SidebarItem
          icon={FaClipboardList}
          label="Contact List"
          to="/contacts"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={FaEnvelope}
          label="Messages"
          to="/sent-messages"
          isCollapsed={isCollapsed}
        />
      </ul>
    </nav>
  );
};

const SidebarItem = ({ icon: Icon, label, to, isCollapsed }) => (
  <li className="mb-4">
    <Link
      to={to}
      className={`flex items-center p-3 rounded-md transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 ${
        isCollapsed ? "justify-center" : ""
      }`}
    >
      <Icon className="mr-3 text-xl" />
      <span className={`${isCollapsed ? 'hidden' : 'text-md'}`}>{label}</span>
    </Link>
  </li>
);

export default Sidebar;
