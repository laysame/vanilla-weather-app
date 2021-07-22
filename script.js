'use strict';
const apiKey = "718938e8a3e4822470de1037fd72347a";
let celsiusTemperature = null;
let currentFeelsLike = null;
let currentMaxTemperature = null;
let currentMinTemperature = null;
const temperatureElement = document.querySelector("#temperature");
const feelsLikeElement = document.querySelector("#feels-like");
const maxMinTemperatureElement = document.querySelector("#high-low-temp");
const cityElement = document.querySelector("#city");
const descriptionElement = document.querySelector("#weather-description");
const humidityElement = document.querySelector("#humidity");
const visibilityElement = document.querySelector("#visibility");
const windElement = document.querySelector("#wind");
const dateTimeElement = document.querySelector("#date-time");
const iconElement = document.querySelector("#icon");
const inputFormElement = document.querySelector("#input-form");
const inputSearchElement = document.querySelector("#input-search");
const forecastElement = document.querySelector("#forecast");

function formatDate(date) {
//calculate the date
    let hours = date.getUTCHours();
    if (hours < 10) {
        hours = `0${hours}`
    }
    let minutes = date.getUTCMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    let currentDate = date.getUTCDate();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    let currentDay = days[date.getUTCDay()];
    const months = ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];
    let currentMonth = months[date.getUTCMonth()];

    return `${currentDay}, ${currentDate} ${currentMonth} <i class="far fa-clock"></i> ${hours}:${minutes}`;
}

function setTimeZone(response) {
    let utcTime = new Date();
    let localTime = new Date(utcTime.getTime() + response * 1000);
    dateTimeElement.innerHTML = formatDate(localTime);
}

function setIcon(dataApi) {
    const iconApi = dataApi;
    const iconMap = {
        '01d': 'sun.png',
        '01n': 'night.png',
        '02d': 'cloudy.png',
        '02n': 'cloud-night.png',
        '03d': 'cloud.png',
        '03n': 'cloud.png',
        '04d': 'broken-clouds.png',
        '04n': 'broken-clouds.png',
        '09d': 'rain.png',
        '09n': 'rain.png',
        '10d': 'rainy.png',
        '10n': 'rainy.png',
        '11d': 'storm.png',
        '11n': 'storm.png',
        '13d': 'snowy.png',
        '13n': 'snowy.png',
        '50d': 'mist.png',
        '50n': 'mist.png',
    };

    iconElement.setAttribute("src", `images/${iconMap[iconApi]}`); //Changing attribute "src" to another value
    iconElement.setAttribute("alt", dataApi[0].description);

}

function formatDay(timeStamp) {
    let date = new Date(timeStamp * 1000);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    let day = days[date.getDay()];

    return day;
}

function displayForecast(response) {

    let forecast = response.data.daily;
    console.log(forecast)
    let forecastHtml = '<div class="row">';
    console.log(forecast[0].weather[0].icon)

    forecast.forEach(function (forecastDay, index) {
        if (index < 6 && index !== 0) {
            forecastHtml = forecastHtml + `
                            <div class="col">
                                <div class="weather-forecast-day m-1">${formatDay(forecastDay.dt)}</div>
                                <img src="images/cloudy.png" alt="" class="weather-forecast-icon m-1">
                                
                                <div class="weather-forecast-temperature m-1">
                                <span class="forecast-temperature-max"><i class="fas fa-arrow-circle-up"></i>${Math.round(forecastDay.temp.max)}°</span>
                                <span class="forecast-temperature-min"><i class="fas fa-arrow-circle-down"></i>${Math.round(forecastDay.temp.min)}°</span>
                                </div>
                            </div>`;
        }

    })
    forecastHtml = forecastHtml + `</div>`;
    forecastElement.innerHTML = forecastHtml;
}

function getForecast(coordinates) {
    let unit = getUnit();
    const latitudeForecast = coordinates.lat;
    const longitudeForecast = coordinates.lon;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitudeForecast}&lon=${longitudeForecast}&appid=${apiKey}&units=${unit}`;

    axios.get(forecastApiUrl).then(displayForecast);
}

function displayTemperature(response) {
    const apiData = response.data;
    const apiMain = apiData.main;
    // Changing Icons
    const apiWeather = apiData.weather[0].icon;
    setIcon(apiWeather);

    let currentCity = apiData.name;
    let currentCountry = apiData.sys.country;
    celsiusTemperature = Math.round(apiMain.temp);
    let currentDescription = apiData.weather[0].description;
    let currentHumidity = apiMain.humidity;
    let currentVisibility = (apiData.visibility) / 1000;
    currentFeelsLike = Math.round(apiMain.feels_like);
    let currentWind = Math.round(apiData.wind.speed);
    currentMaxTemperature = Math.round(apiMain.temp_max);
    currentMinTemperature = Math.round(apiMain.temp_min);
    // Applying Timezone
    const timeZoneAPI = apiData.timezone;
    setTimeZone(timeZoneAPI);

    cityElement.innerHTML = `${currentCity}, ${currentCountry}`;
    temperatureElement.innerHTML = `${celsiusTemperature}°`;
    descriptionElement.innerHTML = currentDescription;
    humidityElement.innerHTML = `<strong>${currentHumidity}%</strong>`;
    visibilityElement.innerHTML = `<strong> ${currentVisibility}km </strong>`;
    feelsLikeElement.innerHTML = `<strong>${currentFeelsLike}°</strong>`;
    windElement.innerHTML = `<strong>${currentWind}km/H</strong>`;
    maxMinTemperatureElement.innerHTML = `<i class="fas fa-arrow-circle-up"></i> Day ${currentMaxTemperature}° <i class="fas fa-arrow-circle-down"></i>
    Night ${currentMinTemperature}°`;

    getForecast(apiData.coord);
}

function updateCity(cityName) {
    let unit = getUnit();
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},&appid=${apiKey}&units=${unit}`;
    axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
    event.preventDefault();
    let searchInput = inputSearchElement.value.trim();

    updateCity(searchInput);
}

function getUnit() {
    return "metric";
}

function handlePosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let unit = getUnit();
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
    axios.get(url).then(displayTemperature);
}

function currentPosition(position) {
    position.preventDefault();
    navigator.geolocation.getCurrentPosition(handlePosition);
}


const buttonSearch = document.querySelector("#btn-search");
const buttonCurrent = document.querySelector("#btn-current");
const fahrenheitButton = document.querySelector("#fahrenheit-btn");
const celsiusButton = document.querySelector("#celsius-btn");

// Events listener
inputFormElement.addEventListener("submit", handleSubmit);
buttonSearch.addEventListener("click", handleSubmit);
buttonCurrent.addEventListener("click", currentPosition);


updateCity("recife");
