// SELECT ELEMENTS
const searchboxElement = document.querySelector('.search-box');
const dateElement = document.querySelector('.date');
const locationElement = document.querySelector(".city-name ");
const tempElement = document.querySelector(".city-temp p");
const iconElement = document.querySelector(".weather-icon");
const descElement = document.querySelector(".temperature-description");

// App data
const weather = {};

weather.temperature = {
    unit : "celsius"
}

// APP CONSTS, LET AND VARS
let now = new Date();
const KELVIN = 273;

// API KEY & URL
const apiKey = {
    key: "95794b10771e61a4d0af20cf5e879342",
    base: "https://api.openweathermap.org/data/2.5/"
}

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition);
}

// SET USER'S POSITION
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}


// SEARCH-BOX
searchboxElement.addEventListener('keypress', setQuery);

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchboxElement.value);
  }
}

function getResults (query) {
  fetch(`${apiKey.base}weather?q=${query}&APPID=${apiKey.key}`)
    .then(response => {
      let data = response.json();
      return data;
    }).then(function(data){
        weather.temperature.value = Math.floor(data.main.temp - KELVIN);
        weather.description = data.weather[0].description;
        weather.iconId = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
    })
    .then(function(){
        displayWeather();
        setBg();
    })
}

// GET WEATHER FROM API PROVIDER
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey.key}`;
    
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.main = data.main;
        })
        .then(function(){
            displayWeather();
            setBg();
        });
}

// DISPLAY WEATHER & DATE TO UI
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    dateElement.innerText = dateBuilder(now);
}

function setBg() {
    let weatherDesc = weather.description

    if (weatherDesc === "clear sky") {
        document.body.style.backgroundImage = 'url("./background/clear.jpg")'
    } else if (weatherDesc === "overcast clouds") {
        document.body.style.backgroundImage = 'url("./background/clouds.jpg")'
    } else if (weatherDesc === "broken clouds" || weatherDesc === "scattered clouds") {
        document.body.style.backgroundImage = 'url("./background/clouds.jpg")'
    } else if (weatherDesc === "moderate rain") {
        document.body.style.backgroundImage = 'url("./background/rain.jpg")'
    } else if (weatherDesc === "Snow") {
        document.body.style.backgroundImage = 'url("./background/snow.jpg")'
    } else if (weatherDesc === "drizzle") {
        document.body.style.backgroundImage = 'url("./background/drizzle.jpg")'
    } else if (weatherDesc === "thunderstorm") {
        document.body.style.backgroundImage = 'url("./background/thunderstorm.jpg")'
    } else if (weatherDesc === "drizzle rain" || weatherDesc === "light rain") {
        document.body.style.backgroundImage = 'url("https://i.gifer.com/V8Sd.gif")'
    } else if (weatherDesc === "few clouds") {
        document.body.style.backgroundImage = 'url("/background/fewclouds2.jpg")'
    } else {
        document.body.style.backgroundImage = 'url("https://i.gifer.com/LjKj.gif")'
    }   
}

// GET CURRENT DATE
function dateBuilder (d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    Date.prototype.getWeek = function() {
        var onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }

    let day = days[d.getDay()];
    let date = d.getDate();
    let week = d.getWeek();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
  
    return `${day} ${date} ${month} ${year}, Week ${week}`;
  }

// C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENT
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});

