class SocketManager {
  constructor() {
    this.socket = io.connect('http://' + appHelper.getIp() + ':' + appHelper.getPort('socket') + '/table');
    this.listen();
  }

  listen() {
    this.socket.on('connected', () => {
      console.log('Socket connected.');
    })
  }
}