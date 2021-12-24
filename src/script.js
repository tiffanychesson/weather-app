// Display current date and time - (on page load)
let currentDate = document.querySelector("#current-date");

let now = new Date();

function formatDate(now) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];

  let date = now.getDate();

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[now.getMonth()];

  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let currentDate = `${day}, ${date} ${month} ${hours}:${minutes}`;

  return currentDate;
}

currentDate.innerHTML = formatDate(now);

// API link foundations
let root = "https://api.openweathermap.org/data/2.5/";
let apiKey = "b1ed8cbb71d26e708aef7f929929627c";
let units = "metric";

// Default to London - (on page load)
function selectDefault() {
  document.querySelector("h1").innerHTML = `London`;
  axios
    .get(`${root}weather?q=${city}&units=${units}&appid=${apiKey}`)
    .then(returnData);
}

let city = "London";
selectDefault();

// Return API data for current weather - (following successful city lookup)
function returnData(response) {
  city = response.data.name;

  getCurrentWeatherColour(response.data.weather[0].main);

  document.querySelector("#current-temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#current-feels-like").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#current-clouds-api").innerHTML =
    response.data.clouds.all;
  document.querySelector("#current-wind-api").innerHTML = Math.round(
    response.data.wind.speed
  );
  document
    .querySelector("#current-weather")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#current-weather")
    .setAttribute("alt", response.data.weather[0].description);
  if (units === "imperial") {
    document.querySelector("#current-wind-imperial").innerHTML = "mph";
  } else if (units === "metric") {
    document.querySelector("#current-wind-imperial").innerHTML = "m/s";
  }

  getForecast(response.data.coord);
}

// Search City via API - (as a result of clicking 🔍 button)
let citySearch = document.querySelector("#search-bar");
let citySearchInput = document.querySelector("#search-bar-input");

function selectCity(event) {
  event.preventDefault();
  document.querySelector("h1").innerHTML = `${citySearchInput.value}`;
  pullTemp();
}

citySearch.addEventListener("submit", selectCity);

// Pull current weather condition data via API - (following successful city lookup)
function pullTemp() {
  if (citySearchInput.value.length > 0) {
    city = citySearchInput.value;
  }
  axios
    .get(`${root}weather?q=${city}&units=${units}&appid=${apiKey}`)
    .then(returnData);
}

// Get current location - (as a result of clicking 📍 button)
let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    axios
      .get(
        `${root}weather?lat=${lat}&lon=${long}&units=${units}&appid=${apiKey}`
      )
      // update current weather conditions in line with current location
      .then((response) => {
        returnData(response);
        document.querySelector("h1").innerHTML = response.data.name;
        citySearchInput.value = "";
      });
  });
});

// Display forecast
function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");

  let forecast = response.data.daily;

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
            <div class="card">
              <div class="card-body">
                <div class="forecast-1">
                  <div class="forecast-weather"><img id="forecast-weather" src="https://openweathermap.org/img/wn/${
                    forecastDay.weather[0].icon
                  }.png" alt="Clear" /></div>
                  <div class="forecast-temp"><span id="forecast-temp-min">${Math.round(
                    forecastDay.temp.min
                  )}</span>° / <span class="forecast-temp-max"> ${Math.round(
          forecastDay.temp.max
        )}</span>°</div>
                </div>
              </div>
            </div>
            <p class="card-label">${formatForecastDay(forecastDay.dt)}</p>
          </div>`;
    }
  });
  forecastElement.innerHTML = forecastHTML;
}

// Get Forecast
function getForecast(coordinates) {
  let lat = coordinates.lat;
  let long = coordinates.lon;
  axios
    .get(`${root}onecall?lat=${lat}&lon=${long}&units=${units}&appid=${apiKey}`)
    .then(displayForecast);
}

// Format day of week for forecast
function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}

// Change background shadow colour dependent on current weather
let weatherColour = document.querySelector("#weather-colour");

function getCurrentWeatherColour(response) {
  if (response === "Clear") {
    weatherColour.classList.add("weather-colour-clear");
    weatherColour.classList.remove("weather-colour-default");
    weatherColour.classList.remove("weather-colour-rain");
  } else if (
    response === "Rain" ||
    response === "Drizzle" ||
    response === "Snow"
  ) {
    weatherColour.classList.add("weather-colour-rain");
    weatherColour.classList.remove("weather-colour-default");
    weatherColour.classList.remove("weather-colour-clear");
  } else {
    weatherColour.classList.add("weather-colour-default");
    weatherColour.classList.remove("weather-colour-rain");
    weatherColour.classList.remove("weather-colour-clear");
  }
}

// Convert Temperatures using C and F "links"
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  units = "metric";
  pullTemp();
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  units = "imperial";
  pullTemp();
}
