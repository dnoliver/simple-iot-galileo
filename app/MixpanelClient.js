var Mixpanel = require("mixpanel");
var config = require("./../package").config;

var MixpanelClient = {
    Event: {
        Light: "Light",
        Temperature: "Temperature",
        Loudness: "Loudness"
    },

    init: function () {
        console.log("MixpanelClient", "init");
        this.mixpanel = Mixpanel.init(config.MixpanelTracker);
        this.mixpanel.people.set("GalileoGen1Board", {
            $distinct_id: "GalileoGen1Board",
            $city: 'Cordoba',
            $region: 'Cordoba'
        });
    },

    track: function (data) {
        console.log("MixpanelClient", "track", data);
        
        if(data.temperature !== undefined ) {
            this.mixpanel.track(this.Event.Temperature, {
                distinct_id: "GalileoGen1Board",
                value: data.temperature
            });
        }
        if(data.light !== undefined) {
            this.mixpanel.track(this.Event.Light, {
                distinct_id: "GalileoGen1Board",
                value: data.light
            });
        }
        if(data.loudness !== undefined) {
            this.mixpanel.track(this.Event.Loudness, {
                distinct_id: "GalileoGen1Board",
                value: data.loudness
            });
        }
    }
};

module.exports = MixpanelClient;