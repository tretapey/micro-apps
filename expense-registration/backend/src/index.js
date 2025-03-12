const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { initializeDatabase } = require('./database');
const expensesRoutes = require('./routes/expenses');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize database
initializeDatabase();

// Routes
app.use('/api/expenses', expensesRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 