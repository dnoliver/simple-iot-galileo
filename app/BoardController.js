var mraa = require('mraa');
var LCD = require('jsupm_i2clcd');
var GroveSensor = require('jsupm_grove');
var Loudness = require('jsupm_loudness');

var BoardController = {
    init: function () {
        console.log("BoardController", "init");
        this.OnBoardLedState = false;
        this.OnBoardLed = new mraa.Gpio(3, false, true); //LED hooked up to digital pin (or built in pin on Galileo Gen1);    
        this.OnBoardLed.dir(mraa.DIR_OUT); //set the gpio direction to output

        // Red Led connected to Digital Port #8
        this.RedLed = new GroveSensor.GroveLed(8);
        this.RedLed.off();
        // Light Sensor connected to Analog Port #0
        this.LightSensor = new GroveSensor.GroveLight(0);
        // Temperature Sensor connected to Analog Port #1
        this.TemperatureSensor = new GroveSensor.GroveTemp(1);
        // Loudness Sensor connected to Analog Port #2
        this.LoudnessSensor = new Loudness.Loudness(2, 5.0);
        // I2C Display in I2C 0
        this.Display = new LCD.Jhd1313m1(0);
        this.Display.setColor(0, 255, 0);
        this.Display.setCursor(0, 0);
        this.Display.write('Intel XDK IOT');
        this.showNetworkIP();
    },

    showNetworkIP: function () {
        var GetNetworkIPs = (function () {
            var ignoreRE = /^(127\.0\.0\.1|::1|fe80(:1)?::1(%.*)?)$/i;

            var exec = require('child_process').exec;
            var cached;
            var command;
            var filterRE;

            switch (process.platform) {
            case 'win32':
                //case 'win64': // TODO: test
                command = 'ipconfig';
                filterRE = /\bIPv[46][^:\r\n]+:\s*([^\s]+)/g;
                break;
            case 'darwin':
                command = 'ifconfig';
                filterRE = /\binet\s+([^\s]+)/g;
                // filterRE = /\binet6\s+([^\s]+)/g; // IPv6
                break;
            default:
                command = 'ifconfig';
                filterRE = /\binet\b[^:]+:\s*([^\s]+)/g;
                // filterRE = /\binet6[^:]+:\s*([^\s]+)/g; // IPv6
                break;
            }

            return function (callback, bypassCache) {
                if (cached && !bypassCache) {
                    callback(null, cached);
                    return;
                }
                // system call
                exec(command, function (error, stdout, sterr) {
                    cached = [];
                    var ip;
                    var matches = stdout.match(filterRE) || [];
                    //if (!error) {
                    for (var i = 0; i < matches.length; i++) {
                        ip = matches[i].replace(filterRE, '$1')
                        if (!ignoreRE.test(ip)) {
                            cached.push(ip);
                        }
                    }
                    //}
                    callback(error, cached);
                });
            };
        })();

        var self = this;

        setInterval(function () {
            GetNetworkIPs(function (NoIP, IP) {
                console.log("BoardController", "IP", IP);
                self.Display.setCursor(1, 0);
                self.Display.write(IP + " ");
            });
        }, 10000);
    },

    toggleAlarm: function () {
        if (this.OnBoardLedState) {
            this.turnOffAlarm();
        } else {
            this.turnOnAlarm();
        }
    },

    turnOnAlarm: function () {
        this.OnBoardLedState = true;
        this.OnBoardLed.write(this.OnBoardLedState ? 1 : 0);
        this.Display.setColor(255, 0, 0);
        this.RedLed.on();
    },

    turnOffAlarm: function () {
        this.OnBoardLedState = false;
        this.OnBoardLed.write(this.OnBoardLedState ? 1 : 0);
        this.Display.setColor(0, 255, 0);
        this.RedLed.off();
    },

    getState: function () {
        console.log("BoardController", "getState");
        // Read Temp Value
        var TempCelsius = this.TemperatureSensor.value();
        // Read Lux Value
        var LuxValue = this.LightSensor.value();
        // Read Loudness Value
        var LoudnessValue = this.LoudnessSensor.loudness();

        return {
            timestamp: Date.now(),
            temperature: TempCelsius,
            loudness: LoudnessValue,
            light: LuxValue
        };
    }
};

module.exports = BoardController;