// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.use('/api/auth', require('./routes/auth'));
app.use('/api/moodboards', require('./routes/moodboards'));

// Proxy Giphy API requests to avoid CORS issues
app.get('/api/giphy', async (req, res) => {
  const { endpoint, ...params } = req.query;
  if (!endpoint) return res.status(400).json({ error: 'Missing endpoint parameter' });
  let url = `https://api.giphy.com/v1/gifs/${endpoint}`;
  try {
    const response = await axios.get(url, { params });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'MoodBoard Lite API is running!',
    version: '1.0.0'
  });
});

// Error handling middleware

// Proxy Giphy API requests to avoid CORS issues
const axios = require('axios');
app.get('/api/giphy', async (req, res) => {
  const { endpoint, ...params } = req.query;
  if (!endpoint) return res.status(400).json({ error: 'Missing endpoint parameter' });
  let url = `https://api.giphy.com/v1/gifs/${endpoint}`;
  try {
    const response = await axios.get(url, { params });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📱 API available at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
