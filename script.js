'use strict';
const apiKey = "718938e8a3e4822470de1037fd72347a";
let celsiusTemperature = null;
let currentFeelsLike = null;
const temperatureElement = document.querySelector("#temperature");
const feelsLikeElement = document.querySelector("#feels-like");
const maxMinTemperatureElement = document.querySelector("#high-low-temp");

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
    const cityElement = document.querySelector("#city");
    let currentCity = response.data.name;
    let currentCountry = response.data.sys.country;
    celsiusTemperature = Math.round(response.data.main.temp);

    const DescriptionElement = document.querySelector("#weather-description");
    let currentDescription = response.data.weather[0].description;
    const humidityElement = document.querySelector("#humidity");
    let currentHumidity = response.data.main.humidity;
    const visibilityElement = document.querySelector("#visibility");
    let currentVisibility = (response.data.visibility) / 1000;

    currentFeelsLike = Math.round(response.data.main.feels_like);
    const windElement = document.querySelector("#wind");
    let currentWind = Math.round(response.data.wind.speed);

    let currentMaxTemperature = Math.round(response.data.main.temp_max);
    let currentMinTemperature = Math.round(response.data.main.temp_min);
    const dateTimeElement = document.querySelector("#date-time");
    const iconElement = document.querySelector("#icon");

    // Applying Timezone
    let utcTime = new Date();
    let localTime = new Date(utcTime.getTime() + response.data.timezone * 1000);
    dateTimeElement.innerHTML = formatDate(localTime);

    cityElement.innerHTML = `${currentCity}, ${currentCountry}`;
    temperatureElement.innerHTML = `${celsiusTemperature}°`;
    DescriptionElement.innerHTML = currentDescription;
    humidityElement.innerHTML = `<strong>${currentHumidity}%</strong>`;
    visibilityElement.innerHTML = `<strong> ${currentVisibility}km </strong>`;
    feelsLikeElement.innerHTML = `<strong>${currentFeelsLike}°</strong>`;
    windElement.innerHTML = `<strong>${currentWind}km/H</strong>`;
    maxMinTemperatureElement.innerHTML = `<i class="fas fa-arrow-circle-up"></i> Day ${currentMaxTemperature}° <i class="fas fa-arrow-circle-down"></i>
    Night ${currentMinTemperature}°`;

    const iconMap = {
        '01d': 'sun.png',
        '01n': 'night.png',
        '02d': 'cloudy.png',
        '02n': 'cloud-night',
        '03d': 'cloud.png',
        '04d': 'broken-clouds.png',
        '09d': 'rain.png',
        '10d': 'rainy.png',
        '11d': 'storm.png',
        '13d': 'snowy.png',
        '50d': 'mist.png',
    };

    let iconApi = response.data.weather[0].icon;
    iconElement.setAttribute("src", `images/${iconMap[iconApi]}`); //Changing attribute "src" to another value
    iconElement.setAttribute("alt", response.data.weather[0].description);

}

function updateCity(cityName) {
    let unit = getUnit();
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},&appid=${apiKey}&units=${unit}`;
    axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
    event.preventDefault();
    const searchInput = inputSearchElement.value.trim();
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

const inputFormElement = document.querySelector("#input-form");
const inputSearchElement = document.querySelector("#input-search");
const buttonSearch = document.querySelector("#btn-search");
const buttonCurrent = document.querySelector("#btn-current");
const fahrenheitButton = document.querySelector("#fahrenheit-btn");
const celsiusButton = document.querySelector("#celsius-btn");


function displayFahrenheitTemperature(event) {
    event.preventDefault();
    celsiusButton.classList.remove("disabled");
    fahrenheitButton.classList.add("disabled")

    let fahrenheitTemperature = Math.round((celsiusTemperature * 9) / 5 + 32);
    temperatureElement.innerHTML = `${fahrenheitTemperature}°`;
    currentFeelsLike = Math.round((currentFeelsLike * 9) / 5 + 32);
    feelsLikeElement.innerHTML = `<strong>${currentFeelsLike}°</strong>`;
}

function displayCelsiusTemperature(event) {
    event.preventDefault();
    fahrenheitButton.classList.remove("disabled")
    celsiusButton.classList.add("disabled");
    temperatureElement.innerHTML = `${celsiusTemperature}°`;
   currentFeelsLike = Math.round((currentFeelsLike -32) *5/9);
   feelsLikeElement.innerHTML = `<strong>${currentFeelsLike}°</strong>`;
   console.log(currentFeelsLike)
}

// Events listener
inputFormElement.addEventListener("submit", handleSubmit);
buttonSearch.addEventListener("click", handleSubmit);
buttonCurrent.addEventListener("click", currentPosition);
fahrenheitButton.addEventListener("click", displayFahrenheitTemperature);
celsiusButton.addEventListener("click", displayCelsiusTemperature);

updateCity("london");
currentPosition();