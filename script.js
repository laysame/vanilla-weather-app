'use strict';
const apiKey = "718938e8a3e4822470de1037fd72347a";
let unit = "metric";

//functions
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

function displayTemperature(response) {
    console.log(response.data)
    const cityElement = document.querySelector("#city");
    let currentCity = response.data.name;
    let currentCountry = response.data.sys.country;
    let currentTemperature = Math.round(response.data.main.temp);
    const temperatureElement = document.querySelector("#temperature");
    const DescriptionElement = document.querySelector("#weather-description");
    let currentDescription = response.data.weather[0].description;
    const humidityElement = document.querySelector("#humidity");
    let currentHumidity = response.data.main.humidity;
    const visibilityElement = document.querySelector("#visibility");
    let currentVisibility = (response.data.visibility) / 1000;
    const feelsLikeElement = document.querySelector("#feels-like");
    let currentFeelsLike = Math.round(response.data.main.feels_like);
    const windElement = document.querySelector("#wind");
    let currentWind = Math.round(response.data.wind.speed);
    const maxMinTemperatureElement = document.querySelector("#high-low-temp");
    let currentMaxTemperature = Math.round(response.data.main.temp_max);
    let currentMinTemperature = Math.round(response.data.main.temp_min);
    const dateTimeElement = document.querySelector("#date-time");
    // Applying Timezone
    let utcTime = new Date();
    let localTime = new Date(utcTime.getTime() + response.data.timezone * 1000);
    dateTimeElement.innerHTML = formatDate(localTime);

    cityElement.innerHTML = `${currentCity}, ${currentCountry}`;
    temperatureElement.innerHTML = `${currentTemperature}°`;
    DescriptionElement.innerHTML = currentDescription;
    humidityElement.innerHTML = `<strong>${currentHumidity}%</strong>`;
    visibilityElement.innerHTML = `<strong> ${currentVisibility}km </strong>`;
    feelsLikeElement.innerHTML = `<strong>${currentFeelsLike}°</strong>`;
    windElement.innerHTML = `<strong>${currentWind}km/H</strong>`;
    maxMinTemperatureElement.innerHTML = `<i class="fas fa-arrow-circle-up"></i> Day ${currentMaxTemperature}° <i class="fas fa-arrow-circle-down"></i>
    Night ${currentMinTemperature}°`;
}

function updateCity(cityName) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},&appid=${apiKey}&units=${unit}`;
    axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
    event.preventDefault();
    const searchInput = inputSearchElement.value.trim();
    updateCity(searchInput);

    console.log(searchInput)
}
function handlePosition (position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
    axios.get(url).then(displayTemperature);
}

function currentPosition (event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(handlePosition);
}

const inputFormElement = document.querySelector("#input-form");
const inputSearchElement = document.querySelector("#input-search");
const buttonSearch = document.querySelector("#btn-search");
const buttonCurrent = document.querySelector("#btn-current");

inputFormElement.addEventListener("submit", handleSubmit);
buttonSearch.addEventListener("click", handleSubmit);
buttonCurrent.addEventListener("click", currentPosition);

updateCity("london");
currentPosition();