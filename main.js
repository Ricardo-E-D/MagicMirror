

Module.register("CustomWeather", {
	defaults: {},
	getScripts: function() {
		return [
		"https://unpkg.com/mqtt@3.0.0/dist/mqtt.min.js"];
	},
	start: function() {
		this.temp = "0";
		this.humid = "0";
		var client = mqtt.connect('wss://mqtt.flespi.io',
			{
				clientId: 'espetandet',
				username: 'FlespiToken ' + "30Zeg20AopbivFfYG0I7klFHoZDm8GS1uF3AvR1H60PruSf0IMVTVqq9fTlbn10F",
				protocolVersion: 5,
				clean: true,
			}
		);
		
        client.on('connect', () => {
            console.log('connected, subscribing');
            client.subscribe('easv/weather', { qos: 0 }, (err) => {
                if (err) {
                    console.log('failed to subscribe to topic "humidity":', err);
                    return;
                }

            });
          
        });

        client.on('message', (topic, msg) => {
            if (topic == "easv/weather") {
                this.humid = msg.toString('utf8');
                var sHumid = JSON.parse(this.humid);
                var hLevel = sHumid.hum;
                this.humid = hLevel;
                
            
                this.temp = msg.toString('utf8');
                var sTemp = JSON.parse(this.temp);
                var tLevel = sTemp.temp;
                this.temp = tLevel;
                this.updateDom();
            }
        });

        client.on('error', (err) => {
            client.end(true) // force disconnect
        });
	},
	getDom: function() {
		var weatherComp = document.createElement("div");
		
		var temp = document.createElement("p");
		var hum = document.createElement("p");
		temp.innerHTML = "Current temp: " + this.temp + " C" ;
		hum.innerHTML = "Current humidity: " + this.humid + " %" ;
		weatherComp.appendChild(temp);
		weatherComp.appendChild(hum);
		return weatherComp;
	},
	notificationReceived: function() {},
	socketNotificationReceived: function() {},
})
