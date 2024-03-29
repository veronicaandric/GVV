module.exports = (function() {
    var dgram = require("dgram"),
    udpSocket = null,
    socketio = require("socket.io"),
    io = null,
    oscParser = require("./OscParser"),

    init = function(params) {
        udpSocket = dgram.createSocket("udp4");
        udpSocket.on("listening", onSocketListening);
        udpSocket.bind(params.oscPort, params.oscHost);

        io = socketio.listen(params.socketPort);
        // io.enable("browser client minification");
        // io.enable("browser client etag");
        // io.enable("browser client gzip");
        // io.set("log level", 1);
        // io.set("transports", [
        //     "websocket",
        //     "flashsocket",
        //     "htmlfile",
        //     "xhr-polling",
        //     "jsonp-polling"
        // ]);
        io.sockets.on("connection", onSocketConnection);
    },

    onSocketListening = function() {
        var address = udpSocket.address();
        console.log("TuioServer listening on: " + address.address + ":" + address.port);
    },

    onSocketConnection = function(socket) {
        udpSocket.on("message", function(msg) {
            socket.emit("osc", oscParser.decode(msg));
        });
    };

    return {
        init: init
    };
}());