const express = require('express');
const cors = require('cors');
require('express-async-errors'); // Async error handling globally
const { errorHandler, notFound } = require('./src/middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.json({ message: 'BlueOps API is running...' });
});

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/projects', require('./src/routes/projectRoutes'));

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
