import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// CORS Configuration
const corsOptions = {
  origin: ['https://contacts-management-web.vercel.app','https://contacts-management-web.vercel.app','https://contacts-otp-ig7a-tejassriavinashagmailcoms-projects.vercel.app/login'] // Allow only your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow cookies and authorization headers
};
app.use(cors(corsOptions));

// Routes
app.get('/', (req, res) => {
  res.send('Working');
});
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, connectDB(), () => console.log(`Server running on port ${PORT}`));
