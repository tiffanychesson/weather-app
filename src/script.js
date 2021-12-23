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
let root = "https://api.openweathermap.org/data/2.5/weather?";
let apiKey = "b1ed8cbb71d26e708aef7f929929627c";
let units = "metric";

// Default to London - (on page load)
function selectDefault() {
  document.querySelector("h1").innerHTML = `London`;
  axios
    .get(`${root}q=london&units=${units}&appid=${apiKey}`)
    .then((response) => {
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
    });
}

selectDefault();

// Search City via API - (as a result of clicking 🔍 button)
let citySearch = document.querySelector("#search-bar");
let citySearchInput = document.querySelector("#search-bar-input");

function selectCity(event) {
  event.preventDefault();
  document.querySelector("h1").innerHTML = `${citySearchInput.value}`;
  pullTemp();
}

// Pull current weather condition data via API - (following successful city lookup)
function pullTemp() {
  let city = citySearchInput.value;
  axios
    .get(`${root}q=${city}&units=${units}&appid=${apiKey}`)
    .then((response) => {
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
    });
}

citySearch.addEventListener("submit", selectCity);

// Get current location - (as a result of clicking 📍 button)
let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    axios
      .get(`${root}lat=${lat}&lon=${long}&units=${units}&appid=${apiKey}`)
      // update current weather conditions in line with current location
      .then((response) => {
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
        document.querySelector("h1").innerHTML = response.data.name;
        citySearchInput.value = response.data.name;
        document
          .querySelector("#current-weather")
          .setAttribute(
            "src",
            `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
          );
        document
          .querySelector("#current-weather")
          .setAttribute("alt", response.data.weather[0].description);
      });
  });
});
