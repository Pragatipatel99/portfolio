const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple and Clean MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
})
.catch((err) => {
  console.error('❌ MongoDB Connection Error:');
  console.error('🔹 Error:', err.message);
  
  if (err.message.includes('ENOTFOUND') || err.message.includes('timeout')) {
    console.error('🔸 Solution: Check your internet connection');
  }
  
  if (err.message.includes('authentication failed')) {
    console.error('🔸 Solution: Check your MongoDB credentials in .env file');
  }
  
  if (err.message.includes('IP') || err.message.includes('whitelist')) {
    console.error('🔸 Solution: Add your IP to MongoDB Atlas whitelist');
    console.error('🔸 Go to: MongoDB Atlas → Network Access → Add IP Address');
  }
  
  console.error('🔸 Server will continue running but database features may not work');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/download', require('./routes/download'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: '🎉 Portfolio API is running!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:3000`);
  console.log(`🔧 API: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
});
