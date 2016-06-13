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

        this.RedLed = new GroveSensor.GroveLed(8);
        this.RedLed.on();

        this.LightSensor = new GroveSensor.GroveLight(0);
        this.TemperatureSensor = new GroveSensor.GroveTemp(1);
        this.LoudnessSensor = new Loudness.Loudness(2, 5.0);

        this.Display = new LCD.Jhd1313m1(0); // setup I2C Display in I2C 2
        this.Display.setColor(0, 255, 0);
        this.Display.setCursor(0, 0);
        this.Display.write('Intel XDK IOT');
        this.Display.setCursor(1, 0);
        this.Display.write('InternetOfThings');
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
    },

    turnOffAlarm: function () {
        this.OnBoardLedState = false;
        this.OnBoardLed.write(this.OnBoardLedState ? 1 : 0);
        this.Display.setColor(0, 255, 0);
    },

    update: function () {
        console.log("BoardController", "update")
    },

    getState: function () {
        console.log("BoardController", "getState");
        var self = this;

        var TempCelsius = self.TemperatureSensor.value();
        var LuxValue = self.LightSensor.value();
        var LoudnessValue = self.LoudnessSensor.loudness();

        return {
            timestamp: Date.now(),
            temperature: TempCelsius,
            loudness: LoudnessValue,
            light: LuxValue
        };
    }
};

module.exports = BoardController;