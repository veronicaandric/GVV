class SocketManager {
  constructor(page) {
    this.socket = io.connect('http://' + appHelper.getIp() + ':' + appHelper.getPort('socket') + '/' + page);
    this.listen();
  }

  listen() {
    this.socket.on('connected', () => {
      console.log('Socket connected.');
    })
  }

  getInstance() {
    return this.socket;
  }
}