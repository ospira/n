const generateMissionControlActions = async (step, scene, missionControlData = null) => {

    let actionsArray = []

    if(step === 'startPickARocket'){
        const response = await fetch(
            "https://api.spacexdata.com/v4/rockets",
          );
          if (!response.ok) {
            alert("SpaceX API Fetch Error :<")
          }
          const data = await response.json();
          data.forEach(rocket => {
            actionsArray.push(
                {
                  text: rocket.name + " | " + rocket.company,
                  data: {rocket_name: rocket.name + " | " + rocket.company},
                }
            )
          });
    }

    else if(step === 'pickALaunch'){
        const response = await fetch(
            "https://api.spacexdata.com/v4/launchpads",
          );
          if (!response.ok) {
            alert("SpaceX API Fetch Error :<")
          }
          const data = await response.json();
          data.forEach(launchpad => {
              actionsArray.push(
                  {
                    text: launchpad.full_name,
                    data: {launchpad_name: launchpad.full_name, latitude: launchpad.latitude, longitude: launchpad.longitude}
                  }
              )
          });
    }

    else if(step === 'confirmWeather'){
        const data = missionControlData.find(data => data.name === 'pickALaunch')['data']
        const lat = data['latitude'].toString().slice(0,6)
        const lon = data['longitude'].toString().slice(0,6)
        const response = await fetch(
            `https://api.weather.gov/points/${lat},${lon}`,
          );
          if (!response.ok) {
            alert("Weather.Gov API Fetch Error :<")
          }
          const weatherData = await response.json();

          const hourlyForecastUrl = weatherData['properties']['forecastHourly']

          const responseTwo = await fetch(
            hourlyForecastUrl
          );
          if (!responseTwo.ok) {
            alert("Weather.Gov Hourly API Fetch Error :<")
          }
          const weatherDataHourly = await responseTwo.json();

          weatherDataHourly['properties']['periods'].slice(0,8).forEach(hour => {
              actionsArray.push(
                {
                    text: `${new Date(hour.startTime).toLocaleString()} | ${hour.temperature}${hour.temperatureUnit} |${hour.shortForecast}`,
                    data: {date: new Date(hour.startTime).toLocaleString(), forecast: `${hour.temperature}${hour.temperatureUnit} |${hour.shortForecast}`}
                }
              )
          });
    }

    else if(step === 'geoLocation'){

        const distanceAway = navigator.geolocation.getCurrentPosition((position) => {
                const launchLocationData = missionControlData.find(data => data.name === 'pickALaunch')['data']
                var R = 3958.8; // Radius of the earth in miles
                var dLat = deg2rad(launchLocationData['latitude']-position.latitude);
                var dLon = deg2rad(launchLocationData['longitude']-position.longitude); 
                var a = 
                  Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2)
                  ; 
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                var d = R * c; // Distance in miles
                return d;
          }, () => {
              return false
          }, {timeout:10000});
        
        //if(distanceAway){
             actionsArray.push(
                {
                    text: `Confirm You Are ${distanceAway} and Go Fullscreen For Liftoff!!`
                }
            )
        // }
        // else{ // try again
        //     alert("Must enable your location sharing to continue :<")
        //     setTimeout(()=>generateMissionControlActions(step, scene, missionControlData), 5000);
        // }
    }

    else if(step === 'liftoff'){
        document.documentElement.requestFullscreen();
        alert("LIFTING OFF!");
        let secondsToGo = 300
        let velocity = 0
        let altitude = 0
        const countdownTimer = setInterval(()=>{
            const maxx = scene.tileManager.map.width * 48
            const maxy = scene.tileManager.map.width * 48
            const toast = scene.rexUI.add.toast({
                x: Math.floor(Math.random() * (maxx - 0 + 1) + 0),
                y: Math.floor(Math.random() * (maxy - 0 + 1) + 0),
                background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, "blue"),
                text: scene.add.text(0, 0, '', {
                    fontSize: '17px'
                }),
                space: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,
            
                    icon: 0,
                    text: 0,
                },
                duration: {
                    in: 100,
                    hold: 1000,
                    out: 100,
                },            
            })
            toast.showMessage(`${secondsToGo} seconds!`)
            secondsToGo--
        }, 1000)  
        setTimeout(() => {
            clearInterval(countdownTimer);
            const launchTimer = setInterval(()=>{
                const maxx = scene.tileManager.map.width * 48
                const maxy = scene.tileManager.map.width * 48
                const toast = scene.rexUI.add.toast({
                    x: maxx/2,
                    y: maxy/2,
                    background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, "blue"),
                    text: scene.add.text(0, 0, '', {
                        fontSize: '17px'
                    }),
                    space: {
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10,
                
                        icon: 0,
                        text: 0,
                    },
                    duration: {
                        in: 100,
                        hold: 4000,
                        out: 100,
                    },            
                })
                toast.showMessage(`Velocity ${velocity}, Altitude ${altitude}`)
                velocity += Math.random() * 100;
                altitude += Math.random() * Math.random() * Math.random() * 50
                setTimeout(()=>{
                    clearInterval(launchTimer);
                })
            }, 5000)
        }, 300000);
    }



    return actionsArray

}

const createLabel = (scene, text) => {
    return scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x5e92f3),

        text: scene.add.text(0, 0, text, {
            fontSize: '24px'
        }),

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    });
}

const matchClickToData = (text, data) => {
    const match = data.find(d => d.text === text)
    if(match){
        return match['data']
    }
}

const deg2rad = (deg) => {
    return deg * (Math.PI/180)
}

export {generateMissionControlActions, createLabel, matchClickToData}