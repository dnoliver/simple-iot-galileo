var io = require("socket.io-client");
var config = require("./../package").config;
var EventEmitter = require('events').EventEmitter;

var SocketClient = {
    init: function () {
        console.log("SocketClient","init");
        //this.socket = io.connect("https://simpleiotbackend.herokuapp.com/");
        this.EventEmitter = new EventEmitter();
        this.socket = io.connect(config.WebSocketEndpoint);
        this.socket.on("connect", this.onConnect.bind(this));
        this.socket.on("controller", this.onControllerMessage.bind(this));
    },
    
    onConnect: function () {
        console.log("SocketClient","onConnect");
        // register this as a producer
        this.socket.emit("room","producer");
        // register this a an actuator
        this.socket.emit("room","actuator");
    },
    
    onControllerMessage: function (data) {
        console.log("SocketClient","onControllerMessage", data);
        this.EventEmitter.emit("Message", data);
    },
    
    emit: function (data) {
        console.log("SocketClient","emit", data);
        this.socket.emit("producer", data);
    }
};

module.exports = SocketClient;