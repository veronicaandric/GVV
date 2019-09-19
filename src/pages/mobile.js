// Init AppHelper
const appHelper = new AppHelper();

// Init socket
const socket = new SocketManager('pages/mobile').getInstance();

/**
 * Socket example
 */
socket.on('fromServer', (msg) => {
    switch(msg.cmd) {
        case 'console log test':
            console.log('Test successful.')
            break;
        case 'update innerHTML test':
            document.getElementById('placeholder').innerHTML = 'Test successful.';
            break;
        case 'send to table test':
            const msg = { cmd: 'console log test', target: 'table', data: { text: 'Hello World!' } };
            sendToServer(msg);
            break;
        default:
            break;
    };
});

const sendToServer = (msg) => {
	socket.emit('fromMobile', msg);
} 