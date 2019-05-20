const net = require('net');

// Start TCP server
const tcpServer = () => {
  const server = net.createServer((tcpSocket) => {
    let rawData = '';

    tcpSocket.on('data', (data) => {
      rawData += data.toString('utf8');
      console.log(rawData);
    });

    tcpSocket.on('close', (error) => {
      console.log('disconnected: ', error);
    });

    tcpSocket.on('error', (error) => {
      console.log('error: ', error);
    });
  });

  server.listen(10000, () => {
    console.log('TCP listening over web on *:10000');
  });

  server.on('connection', () => {
    console.log('TCP connected');
  });

  server.on('error', (error) => {
    console.log('error: ', error);
    tcpServer.close();
  });
};

module.exports = {
  tcpServer,
};
