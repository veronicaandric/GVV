const express = require('express');
const app = express();
const { join } = require('path');
const socketServer = require('./socketServer');
const tuioServer = require('./tuioServer');
const tcpServer = require('./tcpServer');

const file = join(__dirname, '../', 'src', 'index.html'); // Entrypoint

// Listen on port 8080
app.listen(8080, () => {
  console.log('Server started on port 8080');
});

app.on('error', () => {
  console.log('Port 8080 is taken, choose another.');
});

app.use(express.static(join(__dirname,'../','src')));

app.get('/', function (req, res) {
  res.sendFile(file);
})

// Start Socket server
socketServer(app);

// Start Tuio server
tuioServer(app);

// Start TCP server
tcpServer();
