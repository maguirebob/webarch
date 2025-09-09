console.log('Loading Vercel function...');

// Import the Express app
try {
  console.log('Attempting to require server...');
  const app = require('../dist/server.js').default;
  console.log('Server loaded successfully');
  
  // Export the app for Vercel
  module.exports = app;
} catch (error) {
  console.error('Error loading Express app:', error);
  console.error('Error stack:', error.stack);
  
  // Create a simple error handler
  const express = require('express');
  const errorApp = express();
  
  errorApp.get('*', (req, res) => {
    console.log('Error handler called for:', req.url);
    res.status(500).json({ 
      error: 'Server Error', 
      message: 'Failed to load application',
      details: error.message,
      stack: error.stack
    });
  });
  
  module.exports = errorApp;
}
