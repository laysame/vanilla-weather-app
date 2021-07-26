'use strict';
const apiKey = "718938e8a3e4822470de1037fd72347a";
const unit = "metric";

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

let temperature = null;
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
const buttonSearch = document.querySelector("#btn-search");
const buttonCurrent = document.querySelector("#btn-current");
const inputFormElement = document.querySelector("#input-form");
const inputSearchElement = document.querySelector("#input-search");
const forecastElement = document.querySelector("#forecast");

function formatDate(date) {
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

function formatDay(timeStamp) {
    let date = new Date(timeStamp * 1000);
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    let day = weekDays[date.getDay()];

    return day;
}

function setTimeZone(response) {
    let utcTime = new Date();
    let localTime = new Date(utcTime.getTime() + response * 1000);
    dateTimeElement.innerHTML = formatDate(localTime);
}

function setCurrentWeatherIcon(iconName, description) {
    iconElement.setAttribute("src", `images/${iconMap[iconName]}`); //Changing attribute "src" to another value
    iconElement.setAttribute("alt", description);
}

function displayForecast(response) {
    let forecast = response.data.daily;
    let forecastHtml = '<div class="row">';
    let forecastDay;

    for (let index = 1; index < 6; index++) {
        forecastDay = forecast[index];
        forecastHtml = forecastHtml + `
            <div class="col">
                <div class="weather-forecast-day">${formatDay(forecastDay.dt)}</div>
                <img src="images/${iconMap[forecast[index].weather[0].icon]}" alt="${forecast[index].weather[0].description}" class="weather-forecast-icon m-1" id="icon-forecast">
                <div class="weather-forecast-temperature m-1">
                <span class="forecast-temperature-max"><i class="fas fa-arrow-circle-up"></i>${Math.round(forecastDay.temp.max)}°</span>
                <span class="forecast-temperature-min"><i class="fas fa-arrow-circle-down"></i>${Math.round(forecastDay.temp.min)}°</span>
                </div>
            </div>`;
    }

    forecastHtml = forecastHtml + `</div>`;
    forecastElement.innerHTML = forecastHtml;
}

function getForecast(coordinates) {
    const latitudeForecast = coordinates.lat;
    const longitudeForecast = coordinates.lon;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitudeForecast}&lon=${longitudeForecast}&appid=${apiKey}&units=${unit}`;

    axios.get(forecastApiUrl).then(displayForecast);
}

function displayCurrentWeather(response) {
    let apiData = response.data;
    let apiMain = apiData.main;
    let currentCity = apiData.name;
    let currentCountry = apiData.sys.country;
    temperature = Math.round(apiMain.temp);

    setCurrentWeatherIcon(apiData.weather[0].icon, apiData.weather[0].description);

    let currentHumidity = apiMain.humidity;
    let currentVisibility = (apiData.visibility) / 1000;
    let currentWind = Math.round(apiData.wind.speed);
    currentFeelsLike = Math.round(apiMain.feels_like);
    currentMaxTemperature = Math.round(apiMain.temp_max);
    currentMinTemperature = Math.round(apiMain.temp_min);
    // Applying Timezone
    let timeZoneAPI = apiData.timezone;
    setTimeZone(timeZoneAPI);

    cityElement.innerHTML = `${currentCity}, ${currentCountry}`;
    temperatureElement.innerHTML = `${temperature}°C`;
    descriptionElement.innerHTML = apiData.weather[0].description;
    humidityElement.innerHTML = `<strong>${currentHumidity}%</strong>`;
    visibilityElement.innerHTML = `<strong> ${currentVisibility}km </strong>`;
    feelsLikeElement.innerHTML = `<strong>${currentFeelsLike}°C</strong>`;
    windElement.innerHTML = `<strong>${currentWind}km/H</strong>`;
    maxMinTemperatureElement.innerHTML = `<i class="fas fa-arrow-circle-up"></i> Day ${currentMaxTemperature}°C <i class="fas fa-arrow-circle-down"></i>
    Night ${currentMinTemperature}°C`;

    getForecast(apiData.coord);
}

function updateCity(cityName) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},&appid=${apiKey}&units=${unit}`;
    axios.get(apiUrl).then(displayCurrentWeather);
}

function handleSubmit(event) {
    event.preventDefault();
    let searchInput = inputSearchElement.value.trim();

    updateCity(searchInput);
}

function handlePosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
    axios.get(url).then(displayCurrentWeather);
}

function currentPosition() {
    navigator.geolocation.getCurrentPosition(handlePosition);
}

// Events listener
inputFormElement.addEventListener("submit", handleSubmit);
buttonSearch.addEventListener("click", handleSubmit);
buttonCurrent.addEventListener("click", currentPosition);


updateCity("dublin city");