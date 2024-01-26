const http = require('http');
const fs = require('fs');
const { parse } = require('querystring');

const server = http.createServer((req, res) => {
  // Handling only GET requests to the /data endpoint
  if (req.method === 'GET' && req.url.startsWith('/data')) {
    // Extracting query parameters from the URL
    const { n, m } = parse(req.url.split('?')[1]);

    // Checking if 'n' is provided
    if (n) {
      const filePath = `/tmp/data/${n}.txt`;

      // Checking if 'm' is provided
      if (m) {
        // Reading the file content and sending the specified line
        const content = readLine(filePath, parseInt(m));
        sendResponse(res, content);
      } else {
        // Reading the entire file content and sending it
        const content = readFile(filePath);
        sendResponse(res, content);
      }
    } else {
      // 'n' is missing, sending an error response
      sendErrorResponse(res, 'Missing query parameter: n');
    }
  } else {
    // Handling other requests with a 404 response
    sendNotFoundResponse(res);
  }
});

// Function to read the entire file content
function readFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return data;
  } catch (error) {
    return `Error reading file: ${error.message}`;
  }
}

// Function to read a specific line from the file
function readLine(filePath, lineNumber) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');
    return lines[lineNumber - 1] || `Line ${lineNumber} not found`;
  } catch (error) {
    return `Error reading file: ${error.message}`;
  }
}

// Function to send a successful response
function sendResponse(res, content) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(content);
}

// Function to send a 404 Not Found response
function sendNotFoundResponse(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
}

// Function to send an error response
function sendErrorResponse(res, errorMessage) {
  res.writeHead(400, { 'Content-Type': 'text/plain' });
  res.end(errorMessage);
}

// Start the server on port 8080
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
 