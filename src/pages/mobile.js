// Init socket
const socket = new SocketManager('pages/mobile');

socket.on('connected', () => {
    console.log('Mobile socket connected.')
});

socket.on('fromServer', (msg) => {
    switch(msg.cmd) {
        case 'console log test':
            console.log('Test successful.')
            break;
        case 'update innerHTML test':
            document.getElementById('placeholder').innerHTML = 'Test successful.';
        case 'send to table test':
            const msg = { cmd: 'console log test', target: 'table', data: { text: 'Hello World!' } };
            sendToServer(msg);
        default:
            break;
    };
});

const sendToServer = (msg) => {
	socket.emit('fromMobile', msg);
} 