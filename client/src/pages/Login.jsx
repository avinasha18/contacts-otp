import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (token) {
    navigate("/contacts");
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${api}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/contacts");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 w-full">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md text-black">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Login;
