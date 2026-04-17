const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const initDatabase = require('./config/initDb');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const divisionsRoutes = require('./routes/divisions');
const familiesRoutes = require('./routes/families');
const youthRoutes = require('./routes/youth');
const exportRoutes = require('./routes/export');
const qrCodeRoutes = require('./routes/qrcode');
const divisionAuthRoutes = require('./routes/divisionAuth');
const divisionDashboardRoutes = require('./routes/divisionDashboard');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'API Running' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Church Management System API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/divisions', divisionsRoutes);
app.use('/api/admin/families', familiesRoutes);
app.use('/api/admin/youth', youthRoutes);
app.use('/api/admin/export', exportRoutes);
app.use('/api/admin/qrcode', qrCodeRoutes);

app.use('/api/division/auth', divisionAuthRoutes);
app.use('/api/division/dashboard', divisionDashboardRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed, but server will start anyway:', error.message);
    console.log('Server will continue without database connection. Please check your database configuration.');
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();