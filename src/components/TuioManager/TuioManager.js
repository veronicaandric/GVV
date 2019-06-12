class TuioManager {
  constructor() {
    this.client = new Tuio.Client({ host: 'http://' + appHelper.getIp() + ':' + appHelper.getPort('tuio') });

    this.client.on("connect", this.onConnect());
    this.client.on("addTuioCursor", this.onAddTuioCursor);
    this.client.on("updateTuioCursor", this.onUpdateTuioCursor);
    this.client.on("removeTuioCursor", this.onRemoveTuioCursor);
    this.client.on("addTuioObject", this.onAddTuioObject);
    this.client.on("updateTuioObject", this.onUpdateTuioObject);
    this.client.on("removeTuioObject", this.onRemoveTuioObject);
    this.client.on("refresh", this.onRefresh);

    // this.client.connect();
    this.users = {};
    this.count = 0;
  }

  onConnect() {
    console.log('Tuio connected.');
  }

  onAddTuioCursor(addCursor) {     
  }

  onUpdateTuioCursor(updateCursor) {
  }

  onRemoveTuioCursor(removeCursor) {
  }

  onAddTuioObject(updateObject) {
    // Set delay of 500ms to prevent incorrect detection of feducial marker while placing actible on screen
    setTimeout( () => {
      // Addition check for correct detection of feducial marker
      if(updateObject.symbolId >= 0) {
        const userID = updateObject.symbolId;
        let xpos = updateObject.getScreenX(appHelper.getWindowSize().width);
        let ypos = updateObject.getScreenY(appHelper.getWindowSize().height);

        if(appHelper.getScreenOrientation() === 'landscape'){
          ypos = appHelper.getWindowSize().height - updateObject.getScreenX(appHelper.getWindowSize().height) + 15;
          xpos = updateObject.getScreenY(appHelper.getWindowSize().width); 
        }
        
        this.users[userID] = {
          id: userID,
          menu: null,
        }

        console.log('User ' + userID + ' has connected.')
      }
    }, 500);     
  }

  onUpdateTuioObject(updateObject) {
    const angleDegrees = updateObject.getAngleDegrees();
    const rotationSpeed = updateObject.getRotationSpeed();
    const delay = 1;
    const rotationAmount = 1.5;
    let xpos = updateObject.getScreenX(appHelper.getWindowSize().width);
    let ypos = updateObject.getScreenY(appHelper.getWindowSize().height);

    if(appHelper.getScreenOrientation() === 'landscape'){
      ypos = appHelper.getWindowSize().height - updateObject.getScreenX(appHelper.getWindowSize().height) + 15;
      xpos = updateObject.getScreenY(appHelper.getWindowSize().width); 
    }
    if(appHelper.getDeviceType() === 'multi-taction'){
      angleDegrees = updateObject.getAngleDegrees() + 180;
      delay = 1;
    }

    this.count++;
    if(this.count % delay === 0 && updateObject.symbolId >= 0 && this.users[updateObject.symbolId]) {
      const activeMenu = this.users[updateObject.symbolId]['menu'];
      
      // Set menu position respective to actible location
      if(activeMenu) {
        activeMenu.position = new Point(xpos, ypos);
      }
    }
  }

  onRemoveTuioObject(removeObject) {
  }

  onRefresh(time) {  
  }

}