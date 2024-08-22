
# Node.js TCP Server

A simple TCP server built with Node.js to handle HTTP-like requests.

## Features

- **Root (`/`)**: Responds with `200 OK`.
- **GET `/user-agent`**: Returns the `User-Agent` header.
- **GET `/files/<filename>`**: Serves files from the server directory.
- **POST `/files/<filename>`**: Saves data to a file in the server directory.
- **GET `/echo/<message>`**: Echoes back the message; supports gzip encoding.

## Setup

1. **Install Dependencies**: 
   ```bash
   npm install
   ```
   ```bash
   node main.js
   ```

## Testing 

Use Postman to send requests to localhost:4221.
=======
# HTTP-Server
>>>>>>> origin/main
