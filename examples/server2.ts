import http from "http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Greetings from Server 2!\n");
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Server 2 running at http://localhost:${PORT}/`);
});
