/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
var BoardController = require('./app/BoardController');
var SocketClient = require('./app/SocketClient');
var MixpanelClient = require('./app/MixpanelClient');
var config = require('./package').config;

BoardController.init();
SocketClient.init();
MixpanelClient.init();

var SensingInterval = null;

console.log("SensingInterval", config.SensingInterval);

function StartSensing() {
    if (SensingInterval) return;

    SensingInterval = setInterval(function () {
        var state = BoardController.getState();
        // send the state to socket
        SocketClient.emit(state);
        // send event to mixpanel
        MixpanelClient.track(state);
    }, config.SensingInterval);
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