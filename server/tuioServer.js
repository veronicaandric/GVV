const tuio = require('tuio');
const tuioHttp = require('http');

// Start Tuio server
const tuioServer = (app) => {
  const server = tuioHttp.Server(app);

  server.listen(5000, () => {
    console.log('Tuio listening over web on *:5000');
  });

  tuio.init({
    oscPort: 3333,
    oscHost: '0.0.0.0',
    socketPort: tuioHttp,
  });
};

module.exports = {
  tuioServer,
};
