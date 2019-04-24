const PORT_NUMBER = 8000;

const net = require('net');
const express = require('express');
const app = express();
const tuio_http = require('http').Server(app);
const comm_http = require('http').Server(app);
const io = require('socket.io')(comm_http);
const tuio = require("tuio");

const { spawn } = require('child_process');
const { lstatSync, readdirSync, readdir, writeFile } = require('fs')
const { path, join } = require('path')

app.use(express.static(join(__dirname,'../','src')));
// app.use(express.static(join(__dirname,'../','lib')));

app.get('/', function (req, res) {
  res.sendFile(join(__dirname,'../','public','index.html'));
})


/**************** Server Start  **********************/
var server = app.listen(PORT_NUMBER, function () {
   console.log('Server started on port '+ PORT_NUMBER);
}).on('error', function(){
   console.log('Port '+ PORT_NUMBER +' taken');
});



/**************** Tuio Start  **********************/
tuio_http.listen(5000, function (){
  console.log('Tuio listening over web on *: 5000');
});

tuio.init({
  oscPort: 3333,
  oscHost: "0.0.0.0",
  socketPort: tuio_http
});



/**************** TCP Start  **********************/
var TCPserver = net.createServer(function(TCPsocket) {
	let rawData = "";

  TCPsocket.on('data', function(data){
    rawData += data.toString('utf8');
	});

	TCPsocket.on('close', error => {
		console.log('disconnected')
	})

	TCPsocket.on('error', error => {
		console.log('pause')
	})   	
})

TCPserver.listen(10000, function (){
	console.log('TCP listening over web on *: 10000');
});

TCPserver.on('connection', function(){
	console.log('TCP connected');
});

TCPserver.on('error', function(e){
	console.log(e)
	TCPServ.close()
})



/**************** Socket Start  **********************/
//make socket.io global because need access in TCPserver
// var IOsocket;

comm_http.listen(3000,function (){
   console.log('Socket listening over web on *: 3000');
});

var tableIO = io
  .of('/tc-table')
  .on('connection', socket => {
    socket.emit('connected');

    socket.on('fromMain', msg => {
      switch(msg.target){

        case 'table':
          tableIO.emit('fromServer', msg);
        break;

        case 'mobile':
          mobileIO.emit('fromServer', msg);
        break;

        default:
        break;
      }
    })
  })
  
var mobileIO = io
  .of('/tc-mobile')
  .on('connection', socket => {
    socket.emit('connected');

    socket.on('fromMobile', msg => {
      switch(msg.target){
        
        case 'table':
          tableIO.emit('fromServer', msg);
        break;

        case 'mobile':
          mobileIO.emit('fromServer', msg);
        break;

        default:
        break;
      }
    })
  })


function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}