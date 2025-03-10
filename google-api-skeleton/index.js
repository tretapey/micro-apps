require('dotenv').config();
const express = require('express');
const { getSheetData, updateSheetData, testGoogleConnection } = require('./googleApi');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Google API Skeleton',
    endpoints: {
      '/test': 'GET - Test Google API connection',
      '/sheets': 'GET - Retrieve data from a spreadsheet',
      '/sheets': 'POST - Update data in a spreadsheet'
    }
  });
});

// Test route to verify Google API connection
app.get('/test', async (req, res) => {
  try {
    const result = await testGoogleConnection();
    if (result.success) {
      res.json({ status: 'success', message: result.message });
    } else {
      res.status(500).json({ status: 'error', message: result.message });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Route to get data from Google Sheets
app.get('/sheets', async (req, res) => {
  try {
    const { 
      sheetId = process.env.GOOGLE_SHEET_ID, 
      range = 'A:Z',
      sheetName = '',
      columns = '',
      search = '',
      page,
      pageSize
    } = req.query;
    
    if (!sheetId) {
      return res.status(400).json({ error: 'A spreadsheet ID is required' });
    }

    // Parse columns if provided
    const columnArray = columns ? columns.split(',').map(col => col.trim()) : [];
    
    // Parse pagination parameters - only if they are explicitly provided
    const pageNumber = page ? parseInt(page, 10) || 1 : 1;
    const pageSizeNumber = pageSize ? parseInt(pageSize, 10) || 0 : 0;

    const result = await getSheetData(
      sheetId, 
      range, 
      sheetName, 
      columnArray, 
      search,
      pageNumber,
      pageSizeNumber
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update data in Google Sheets
app.post('/sheets', async (req, res) => {
  try {
    const { 
      sheetId = process.env.GOOGLE_SHEET_ID, 
      range, 
      values,
      sheetName = '' 
    } = req.body;
    
    if (!sheetId) {
      return res.status(400).json({ error: 'A spreadsheet ID is required' });
    }
    
    if (!range) {
      return res.status(400).json({ error: 'A range is required for updating' });
    }
    
    if (!values || !Array.isArray(values)) {
      return res.status(400).json({ error: 'Valid values are required for updating' });
    }

    const result = await updateSheetData(sheetId, range, values, sheetName);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 