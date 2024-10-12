const userLocation  =  document.getElementById("userLocation"),
converter = document.getElementById("converter"),
weatherIcon = document.querySelector(".weather-icon"),
temperature = document.querySelector(".temperature"),
feellikes = document.querySelector(".feels-like"),
description = document.querySelector(".desciption"),
date = document.querySelector(".date"),
city = document.querySelector(".city")

Hvalue = document.getElementById("Hvalue"),
Wvalue = document.getElementById("Wvalue"),
SRvalue = document.getElementById("SRvalue"),
SSvalue = document.getElementById("SSvalue"),
CVvalue = document.getElementById("Cvalue"),
UVvalue = document.getElementById("UVvalue"),
Pvalue = document.getElementById("Pvalue"),
Forecast = document.querySelector(".forcast");

const apiKey = "f9462b590e641e62961482a80c7aaca6";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
WEATHER_ENDPOINT = `https://api.openweathermap.org/data/2.5/onecall?exclude=minutely&units=metric&q=`;

const url = `https://api.openweathermap.org/data/2.5/forecast?&units=metric&q=`;

async function findUserLocation(){
    const response = await fetch(apiUrl + userLocation.value + `&appid=${apiKey}`);
    const res = await fetch(url + userLocation.value + `&appid=${apiKey}`);
    var forcast = await res.json()
    var data = await response.json();
    displayWeather(forcast);
    console.log(forcast);
    if(data.cod!=''&& data.cod!=200)
    {
        alert("Please search Valid City")
        return;
    }


    city.innerHTML = data.name+", "+data.sys.country;
    temperature.innerHTML = Math.floor(data.main.temp)+`<span>°C</span>`;
    feellikes.innerHTML = "Feels like "+ Math.floor(data.main.feels_like)+`<span>°C</span>`;
    description.innerHTML = `<i class="fa-brands fa-cloudversify"></i> &nbsp;`+data.weather[0].description;
   

    Hvalue.innerHTML = Math.round(data.main.humidity)+`<span>%</span>`;
    Wvalue.innerHTML = data.wind.speed+`&nbsp;<span style="font-size:15px;">Km/h</span>`;
    const options1 =
    {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    };
    SRvalue.innerHTML = getLongFormatedateTime(data.sys.sunrise,data.timezone,options1);
    SSvalue.innerHTML = getLongFormatedateTime(data.sys.sunset,data.timezone,options1);

    const options =
    {
        hour: "numeric",
        minute: "numeric",
        weekday: "long",
        month: "long",
        day: "numeric",
        hour12: true,
    }

    date.innerHTML = getLongFormatedateTime(
        data.dt,
        data.timezone,
        options,
    );

    CVvalue.innerHTML = data.clouds.all+`<span>%</span>`;
    UVvalue.innerHTML = data.main.uvi;
    Pvalue.innerHTML = data.main.pressure+`<span>hPa</span>`;

    weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;
    // console.log(data);
    // console.log(Math.floor(data.main.temp));
    // console.log(data.name);
    userLocation.value="";    
    // console.log(data.coord.lon, data.coord.lat)
}



function displayWeather(forcast) {
    // const forecastDiv = document.getElementById('forecast');
        Forecast.innerHTML = ''; // Clear previous results

    const days = {};

    // Group by date
    forcast.list.forEach(item => {
        const options = {
            weekday: "long",
            month: "long",
            day: "numeric",
        };
        let date = getLongFormatedateTime(item.dt,0,options).split(" at ")[0];
        // const date = item.dt_txt.split(' ')[0]; // Get the date part
        if (!days[date]) {
            days[date] = [];
        }
        days[date].push(item);
    });

    // Create a summary for each day
    Object.keys(days).forEach(date => {
        const dailyData = days[date];
        const averageTemp = dailyData.reduce((acc, curr) => acc + curr.main.temp, 0) / dailyData.length;
        const description = dailyData[0].weather[0].description;
        const icon = dailyData[0].weather[0].icon;

        const forecastItem = document.createElement('div');

        // forecastItem.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`;
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <h3>${date}</h3>
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}" style="width: 100%; height: 90%; align-item center; text-align:center;">
            <p style="font-size: 12px; ">Average Temperature: ${averageTemp.toFixed(1)} °C</p>
            <p  style="font-size: 12px; ">Condition: ${description}</p>
        `;
        Forecast.appendChild(forecastItem);
    });
}








function formatUnixTime(date, offset, options = {}){
    const date1 = new Date((date + offset)*1000);
    return date1.toLocaleTimeString([],{ timeZone: "UTC", ...options });
}

function getLongFormatedateTime(date, offset, options){
    return formatUnixTime(date,offset,options);
}

userLocation.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        findUserLocation();
    }
  });

