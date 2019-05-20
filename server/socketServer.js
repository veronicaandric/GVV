const commHttp = require('http');
const io = require('socket.io');

// Start Socket server
const socketServer = (app) => {
  const server = commHttp.Server(app);
  const socketIO = io(server);

  server.listen(3000, () => {
    console.log('Socket listening over web on *:3000');
  });

  const tableIO = socketIO.of('/tc-table');
  const mobileIO = socketIO.of('/tc-mobile');

  tableIO.on('connection', (socket) => {
    socket.emit('connected');
    socket.on('fromMain', (msg) => {
      switch (msg.target) {
        case 'table':
          tableIO.emit('fromServer', msg);
          break;

        case 'mobile':
          mobileIO.emit('fromServer', msg);
          break;

        default:
          break;
      }
    });
  });

  mobileIO.on('connection', (socket) => {
    socket.emit('connected');

    socket.on('fromMobile', (msg) => {
      switch (msg.target) {
        case 'table':
          tableIO.emit('fromServer', msg);
          break;

        case 'mobile':
          mobileIO.emit('fromServer', msg);
          break;

        default:
          break;
      }
    });
  });
};

module.exports = {
  socketServer,
};
