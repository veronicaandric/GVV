// Init AppHelper
const appHelper = new AppHelper();

// Init socket
const socket = new SocketManager('pages/table').getInstance();

// Init Tuio
const tuio = new TuioManager();

// Init Scene
const scene = new SceneManager();
const canvas = scene.initCanvas('canvas', appHelper.getWindowSize());

// Init SelectionBar
new SelectionBar();

/** 
 * Socket Example
 */

// Button events
$('#btn1').click(() => {
    const msg = { cmd: 'console log test', target: 'mobile' };
    sendToServer(msg);
})
$('#btn2').click(() => {
    const msg = { cmd: 'update innerHTML test', target: 'mobile', data: {} };
    sendToServer(msg);
})
$('#btn3').click(() => {
    const msg = { cmd: 'send to table test', target: 'mobile', data: {} };
    sendToServer(msg);
})

// Socket events
socket.on('fromServer', (msg) => {
    switch(msg.cmd) {
        case 'console log test':
            console.log(msg.data.text);
            break;
        default:
            break;
    };
});

const sendToServer = (msg) => {
	socket.emit('fromTable', msg);
} 