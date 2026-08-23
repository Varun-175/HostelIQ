import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/database';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

import studentRoutes from './routes/student.routes';
import roomRoutes from './routes/room.routes';
import allocationRoutes from './routes/allocation.routes';
import analyticsRoutes from './routes/analytics.routes';
import searchRoutes from './routes/search.routes';
import adminRoutes from './routes/admin.routes';
import authRoutes from './routes/auth.routes';

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/allocations', allocationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Health Endpoint
app.get('/api/health', (req, res) => {
  const databaseState = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown';
  res.status(200).json({
    success: true,
    service: 'HostelIQ API',
    database: databaseState,
  });
});

// Unknown Routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(() => {
  process.exitCode = 1;
});
