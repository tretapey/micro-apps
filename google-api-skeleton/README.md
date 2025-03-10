# Google API Skeleton

A Node.js application that provides a skeleton for interacting with the Google Docs/Sheets API. Simply configure your credentials in a `.env` file and start using the API immediately.

## Features

- Quick connection to Google Sheets
- RESTful endpoints for reading and writing data
- Easy configuration through environment variables
- Modular and extensible structure
- Filter data by specific columns
- Search functionality to find specific text
- Support for multiple sheets within a spreadsheet

## Prerequisites

- Node.js (v14 or higher)
- A Google Cloud Platform account
- Google service account credentials

## Setup

1. Clone this repository:
   ```
   git clone <repository-url>
   cd google-api-skeleton
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure your Google credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google Sheets API
   - Create a service account and download the JSON key
   - Share your spreadsheet with the service account email

4. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

5. Edit the `.env` file with your credentials:
   ```
   PORT=3000
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
   GOOGLE_PROJECT_ID=your-project-id
   GOOGLE_SHEET_ID=your-spreadsheet-id
   ```

   > **Note**: For the private key, copy the content from the downloaded JSON file and make sure to replace line breaks with `\n`.

## Usage

### Start the server

```
npm start
```

For development (with auto-reload):
```
npm run dev
```

### Test your connection

Before using the API endpoints, you can test your Google API connection:

```
GET /test
```

This will verify if your credentials are correctly configured.

### Available Endpoints

#### Get data from a spreadsheet

```
GET /sheets?sheetId=YOUR_SHEET_ID&range=A1:D10&sheetName=Sheet1&columns=Name,Email,Phone&search=john
```

Query parameters:
- `sheetId` (optional if defined in .env): Spreadsheet ID
- `range` (optional, default 'A1:Z1000'): Cell range to read
- `sheetName` (optional): Name of the specific sheet in the spreadsheet (e.g., 'Sheet1', 'Orders', etc.)
- `columns` (optional): Comma-separated list of column names to include in the response
- `search` (optional): Text to search for in any cell of the spreadsheet

When using the `columns` parameter:
- The first row of the sheet is assumed to be the header row with column names
- Only the specified columns will be included in the response
- Data will be returned as an array of objects, with column names as keys
- Column names are case-insensitive for matching

When using the `search` parameter:
- Only rows containing the search text (in any cell) will be returned
- The search is case-insensitive
- The search works with both raw data and column-filtered data
- If used with `columns`, the search is applied first, then the column filtering

Example response with columns parameter and search:
```json
{
  "data": [
    {
      "Name": "John Doe",
      "Email": "john@example.com",
      "Phone": "555-1234"
    }
  ]
}
```

#### Update data in a spreadsheet

```
POST /sheets
```

Request body (JSON):
```json
{
  "sheetId": "YOUR_SHEET_ID",
  "range": "A1:B2",
  "values": [
    ["Value1", "Value2"],
    ["Value3", "Value4"]
  ],
  "sheetName": "Sheet1"
}
```

Parameters:
- `sheetId` (optional if defined in .env): Spreadsheet ID
- `range` (required): Cell range to update
- `values` (required): 2D array of values to write
- `sheetName` (optional): Name of the specific sheet in the spreadsheet

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Make sure your service account email is correct
   - Verify that your private key is properly formatted with `\n` for line breaks
   - Ensure the private key is enclosed in double quotes in the .env file

2. **Permission Denied (403)**
   - Share your Google Sheet with the service account email (with Editor permissions)
   - Make sure the Google Sheets API is enabled in your Google Cloud project

3. **Spreadsheet Not Found (404)**
   - Verify the spreadsheet ID is correct
   - Check if the spreadsheet exists and is accessible to your service account

4. **Private Key Format**
   - The private key should include the BEGIN and END markers
   - All line breaks must be replaced with `\n`
   - The entire key should be wrapped in double quotes
   - Example format:
     ```
     GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEF...\n-----END PRIVATE KEY-----\n"
     ```

5. **Column Filtering**
   - Make sure the column names match those in your spreadsheet (case-insensitive)
   - Verify that the first row of your data contains headers
   - Separate multiple column names with commas in the request

6. **Search Functionality**
   - The search is applied to all cells in the specified range
   - If no results are returned, try broadening your search term
   - Search is case-insensitive for better matching

## Extension

This skeleton is designed to be easily extensible:

- Add more endpoints in `index.js`
- Extend Google API functionalities in `googleApi.js`
- Integrate with other Google APIs (Docs, Drive, etc.)

## License

MIT 