class AppHelper {
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.orientation = 'portrait';
    this.deviceType = 'laptop';
    //this.ip = '192.168.0.108';
    this.ip = '10.0.1.43';
    this.ports = {
      app: '8080',
      socket: '3000',
      tuio: '5000',
    };
    this.data = $.getJSON( "../testData/Sample_Rare05_Dmg_RESULT_Copy.json");
    this.lengths = $.getJSON( "../testData/Sample_lengths.json");
  }

  getWindowSize() {
    return {
      width: this.width,
      height: this.height,
    };
  }

  getScreenOrientation() {
    return this.orientation;
  }

  getDeviceType() {
    return this.deviceType;
  }

  getIp() {
    return this.ip;
  }

  getPort(type) {
    switch(type) {
      case 'app':
        return this.ports.app;
        break;
      case 'socket':
        return this.ports.socket;
        break;
      case 'tuio':
        return this.ports.tuio;
        break;
      default:
        console.error('@AppHelper.getPort(type): port type needs to be specified.');
        break;
    }
  }

  getLen(key) {
    if(key) {
      return this.lengths.responseJSON[key];
    } else {
      return this.lengths.responseJSON;
    } 
  }

  getData(key) {
    if(key) {
      return this.data.responseJSON[key];
    } else {
      return this.data.responseJSON;
    } 
  }
}
