// Init AppHelper
const appHelper = new AppHelper();

// Init socket
const socket = new SocketManager('pages/table');

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
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');

// Button events
btn1.on('click', () => {
    const msg = { cmd: 'console log test', target: 'table' };
    sendToServer(msg);
})
btn2.on('click', () => {
    const msg = { cmd: 'update innerHTML test', target: 'table', data: {} };
    sendToServer(msg);
})
btn3.on('click', () => {
    const msg = { cmd: 'send to table test', target: 'table', data: {} };
    sendToServer(msg);
})

// Socket events
socket.on('connected', () => {
    console.log('Table socket connected.')
});

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