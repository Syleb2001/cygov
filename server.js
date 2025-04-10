import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import https from 'https';
import fs from 'fs';

// Import routes
import authRoutes from './src/routes/auth.js';
import controlRoutes from './src/routes/controls.js';
import maturityRoutes from './src/routes/maturity.js';
import notesRoutes from './src/routes/notes.js';
import deadlinesRoutes from './src/routes/deadlines.js';
import poisRoutes from './src/routes/pois.js';
import adminRoutes from './src/routes/admin.js';
import { readTempTokens, writeTempTokens } from './src/utils/db.js';

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
});

// CORS configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(limiter);
app.use(cors(corsOptions));
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin" }
}));
app.use(hpp());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(compression());
app.use(express.json({ limit: '10kb' }));

// Serve static files with correct CORS headers
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Clean expired tokens periodically
const cleanExpiredTokens = () => {
  const tokens = readTempTokens();
  const now = new Date();
  const validTokens = Object.entries(tokens).reduce((acc, [token, data]) => {
    if (new Date(data.expiresAt) > now) {
      acc[token] = data;
    }
    return acc;
  }, {});
  writeTempTokens(validTokens);
};
setInterval(cleanExpiredTokens, 1000 * 60 * 60); // Every hour

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/controls', controlRoutes);
app.use('/api/maturity', maturityRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/deadlines', deadlinesRoutes);
app.use('/api/pois', poisRoutes);
app.use('/api/admin', adminRoutes);

// Handle preflight requests
app.options('*', cors(corsOptions));

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Global error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (process.env.NODE_ENV === 'development') {
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message,
      stack: err.stack
    });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server...');
  app.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Create HTTP server
app.listen(PORT, () => {
  console.log(`HTTP server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});