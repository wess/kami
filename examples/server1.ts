import http from "http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from Server 1!\n");
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server 1 running at http://localhost:${PORT}/`);
});
