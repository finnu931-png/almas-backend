const express = require('express');
const router = express.Router();

// GET / - Home page
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Almas Pay API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;