const net = require("net");
const fs = require("fs");
const path = require("path");
const zlib = require('zlib');

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {

  socket.on('data',(data)=>{
    const request = data.toString();
    const url = request.split(" ")[1];
    const method = request.split(" ")[0];
    if(url == "/"){
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    }
    else if(url === "/user-agent" && method === "GET"){
      const requestLines = request.split("\r\n")
      const userAgentLine = requestLines.find(line => line.startsWith("User-Agent:"));

      if(userAgentLine){
        const userAgent = userAgentLine.split(": ")[1];
        const httpResponse = (`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`);
        socket.write(httpResponse)
      }
      else{
        const httpResponse = "HHTP/1.1 400 Not Found \r\n\r\n";
        socket.write(httpResponse);
      }
    }

  // GET Request for getting files
    else if(url.startsWith("/files/") && method === "GET"){
      const directory = path.join(__dirname); // To run with PostMan
      const filename = url.split("/files/")[1];
      if(fs.existsSync(`${directory}/${filename}`)){
        const content = fs.readFileSync(`${directory}/${filename}`).toString();
        const httpResponse = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}`;
        socket.write(httpResponse);
      }
      else{
        const httpResponse = "HTTP/1.1 404 Not Found\r\n\r\n";
        socket.write(httpResponse);
      }
    }
//accept Encoding
    else if(url.includes("/echo/")){
      const content = url.split("/echo/")[1];
        const requestLines = request.split("\r\n");
        const acceptEncodingLine = requestLines.find(line => line.startsWith("Accept-Encoding:"));
      if(acceptEncodingLine && acceptEncodingLine.includes("application/gzip")){
        const gzip = zlib.gzipSync(content);
        const httpResponse = `HTTP/1.1 200 OK\r\nContent-Encoding: application/gzip\r\nContent-Type: text/plain\r\nContent-Length: ${gzip.length}\r\n\r\n`;
        socket.write(httpResponse);
        socket.write(gzip); // I wrote it this way beacuse the ${} always converts the buffer to string which corrupts the data. 
      } else {
        const httpResponse = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`;
        socket.write(httpResponse);
      }
    }

    // POST request
    else if(url.includes("/files/") && method === "POST"){
      const directory = path.join(__dirname); // To run with PostMan
      const filename = url.split("/files/")[1];
      const url_path = `${directory}/${filename}`;
      const req = data.toString().split("\r\n");
      const body = req[req.length -1];
      fs.writeFileSync(url_path, body);
      const httpResponse = "HTTP/1.1 201 Created\r\n\r\n"
      socket.write(httpResponse);
    }

    // accept-encoding request

    else{
      const httpResponse = "HTTP/1.1 404 Not Found\r\n\r\n";
      socket.write(httpResponse);
    }
    socket.end();
  })
});

server.listen(4221, "localhost");
