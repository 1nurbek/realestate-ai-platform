require('dotenv').config();
const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');

const port = Number(process.env.PORT) || 5000;
const host = process.env.HOST || '0.0.0.0';
const server = http.createServer(app);

initializeSocket(server);

server.listen(port, host, () => {
  console.log(`Backend listening on ${host}:${port}`);
});