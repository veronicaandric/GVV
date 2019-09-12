// Init AppHelper
const appHelper = new AppHelper();

// Init socket
const socket = new SocketManager('pages/mobile');

// Init Tuio
const tuio = new TuioManager();



var closebtns = document.getElementsByClassName("close");
var i;

for (i = 0; i < closebtns.length; i++) {
  closebtns[i].addEventListener("click", function() {
    this.parentElement.style.display = 'none';
  });
}