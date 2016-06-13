/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
var BoardController = require('./app/BoardController');
var SocketClient = require('./app/SocketClient');

BoardController.init();
SocketClient.init();

var SensingInterval = null;

function StartSensing() {
    if (SensingInterval) return;

    SensingInterval = setInterval(function () {
        var state = BoardController.getState();
        SocketClient.emit(state);
    }, 5000);
}

function StopSensing() {
    if (SensingInterval) {
        clearInterval(SensingInterval);
        SensingInterval = null;
    }
}

function StartAlarm() {
    BoardController.turnOnAlarm();
}

function StopAlarm() {
    BoardController.turnOffAlarm();
}

SocketClient.EventEmitter.on("Message", function (message) {
    var hasCommand = message && message.command;

    if (!hasCommand) return;

    switch (message.command) {
    case "StartAlarm":
        StartAlarm()
        break;
    case "StopAlarm":
        StopAlarm();
        break;
    default:
        console.log("Unknown Command", message.command);
    }
});

StartSensing();