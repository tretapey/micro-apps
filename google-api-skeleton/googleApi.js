const { google } = require('googleapis');

// Configure Google authentication
function getAuthClient() {
  try {
    // Process the private key to ensure proper formatting
    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
    
    // Create the auth client
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    
    return auth;
  } catch (error) {
    console.error('Error creating authentication client:', error);
    throw new Error(`Google authentication configuration error: ${error.message}. Check your environment variables.`);
  }
}

// Process sheet data to filter by column names and/or search text
function processSheetData(data, columns = [], searchText = '') {
  if (!data || data.length === 0) {
    return [];
  }

  const headers = data[0];
  let filteredData = data;

  // If search text is provided, filter the data first
  if (searchText && searchText.trim() !== '') {
    const searchLower = searchText.toLowerCase();
    
    // Start from row 1 (skip headers)
    filteredData = [headers];
    
    // Add rows that contain the search text in any cell
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rowContainsSearchText = row.some(cell => 
        cell && cell.toString().toLowerCase().includes(searchLower)
      );
      
      if (rowContainsSearchText) {
        filteredData.push(row);
      }
    }
  }

  // If no columns specified, convert the filtered data to array of objects
  if (!columns || columns.length === 0) {
    const result = [];
    
    // For each row (except header row)
    for (let i = 1; i < filteredData.length; i++) {
      const row = filteredData[i];
      const rowObject = {};
      
      // Add all columns to the result
      headers.forEach((header, index) => {
        rowObject[header] = row[index] || '';
      });
      
      result.push(rowObject);
    }
    
    return result;
  }

  // If columns are specified, filter by those columns
  const result = [];
  
  // Find indices of requested columns
  const columnIndices = columns.map(col => {
    const index = headers.findIndex(header => 
      header.toLowerCase() === col.toLowerCase()
    );
    return index !== -1 ? index : null;
  });

  // Check if any requested columns were found
  if (columnIndices.every(idx => idx === null)) {
    throw new Error(`None of the requested columns (${columns.join(', ')}) were found in the sheet.`);
  }

  // For each row (except header row)
  for (let i = 1; i < filteredData.length; i++) {
    const row = filteredData[i];
    const filteredRow = {};
    
    // Add only the requested columns to the result
    columnIndices.forEach((colIndex, idx) => {
      if (colIndex !== null) {
        filteredRow[headers[colIndex]] = row[colIndex] || '';
      }
    });
    
    result.push(filteredRow);
  }

  return result;
}

// Get data from a Google Sheet
async function getSheetData(sheetId, range, sheetName = '', columns = [], searchText = '') {
  try {
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    
    // If sheetName is provided, prepend it to the range
    const fullRange = sheetName ? `${sheetName}!${range}` : range;
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: fullRange,
    });
    
    const data = response.data.values;
    
    // Process the data with filtering by columns and/or search text
    return processSheetData(data, columns, searchText);
  } catch (error) {
    console.error('Error getting data from Google Sheets:', error);
    
    // Provide more detailed error information
    if (error.code === 404) {
      throw new Error(`Spreadsheet not found. Check if the sheet ID (${sheetId}) is correct and the service account has access to it.`);
    } else if (error.code === 403) {
      throw new Error(`Permission denied. Make sure your service account (${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}) has access to the spreadsheet.`);
    } else if (error.code === 401) {
      throw new Error('Authentication failed. Check your service account credentials.');
    }
    
    throw new Error(`Error retrieving data: ${error.message}`);
  }
}

// Update data in a Google Sheet
async function updateSheetData(sheetId, range, values, sheetName = '') {
  try {
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    
    // If sheetName is provided, prepend it to the range
    const fullRange = sheetName ? `${sheetName}!${range}` : range;
    
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: fullRange,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: values
      },
    });
    
    return {
      updatedCells: response.data.updatedCells,
      updatedRows: response.data.updatedRows,
      updatedColumns: response.data.updatedColumns,
      updatedRange: response.data.updatedRange
    };
  } catch (error) {
    console.error('Error updating data in Google Sheets:', error);
    
    // Provide more detailed error information
    if (error.code === 404) {
      throw new Error(`Spreadsheet not found. Check if the sheet ID (${sheetId}) is correct and the service account has access to it.`);
    } else if (error.code === 403) {
      throw new Error(`Permission denied. Make sure your service account (${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}) has access to the spreadsheet.`);
    } else if (error.code === 401) {
      throw new Error('Authentication failed. Check your service account credentials.');
    }
    
    throw new Error(`Error updating data: ${error.message}`);
  }
}

// Add a test function to verify credentials
async function testGoogleConnection() {
  try {
    const auth = getAuthClient();
    await auth.authorize();
    return { success: true, message: 'Authentication successful' };
  } catch (error) {
    console.error('Authentication failed:', error);
    return { success: false, message: error.message };
  }
}

module.exports = {
  getSheetData,
  updateSheetData,
  testGoogleConnection
}; 