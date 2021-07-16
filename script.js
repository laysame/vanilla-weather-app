'use strict';
const apiKey = "718938e8a3e4822470de1037fd72347a";
let unit = "metric";
let cityName = "lisboa";

//functions
function displayTemperature(response) {
    console.log(response.data)
    const cityElement = document.querySelector("#city");
    const currentCity = response.data.name;
    const currentCountry = response.data.sys.country;
    cityElement.innerHTML = `${currentCity}, ${currentCountry}`;
    const currentTemperature = Math.round(response.data.main.temp);
    const temperatureElement = document.querySelector("#temperature");
    temperatureElement.innerHTML = `${currentTemperature}°`;
    const DescriptionElement = document.querySelector("#weather-description");
    const currentDescription = response.data.weather[0].description;
    DescriptionElement.innerHTML = currentDescription;
    const humidityElement = document.querySelector("#humidity");
    const currentHumidity = response.data.main.humidity;
    humidityElement.innerHTML = `<i class="fas fa-water"></i> Humidity <strong>${currentHumidity}%</strong>`;
    const pressureElement = document.querySelector("#pressure");
    const currentPressure = response.data.main.pressure;
    pressureElement.innerHTML = `<i class="fas fa-compress-alt"></i> Pressure <strong>${currentPressure}hPa</strong>`;
    const visibilityElement = document.querySelector("#visibility");
    const currentVisibility = (response.data.visibility) / 1000;
    visibilityElement.innerHTML = `<i class="far fa-lightbulb"></i> Visibility <strong> ${currentVisibility}km </strong>`;
    const feelsLikeElement = document.querySelector("#feels-like");
    const currentFeelsLike = Math.round(response.data.main.feels_like);
    feelsLikeElement.innerHTML = `<i class="fas fa-temperature-low"></i> Feels like <strong>${currentFeelsLike}°</strong>`;
    const maxMinTemperatureElement = document.querySelector("#high-low-temp");
    const currentMaxTemperature = Math.round(response.data.main.temp_max);
    const currentMinTemperature = Math.round(response.data.main.temp_min);
    maxMinTemperatureElement.innerHTML = `<i class="fas fa-arrow-circle-up"></i> Day ${currentMaxTemperature}° <i class="fas fa-arrow-circle-down"></i>
    Night ${currentMinTemperature}°`;
}

const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},&appid=${apiKey}&units=${unit}`;
axios.get(apiUrl).then(displayTemperature);
