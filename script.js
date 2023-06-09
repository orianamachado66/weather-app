// Challenge 1 - Changing the date

let now = new Date(); //this allows us to create a variable and, inside of it, store the current time

function displayDate(date) {
  let currentDate = document.querySelector("#current"); // here I am selecting the ID current

  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  let day = days[now.getDay()];

  let todayDate = now.getDate();

  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[now.getMonth()];
  let year = now.getFullYear();

  currentDate.innerHTML = `Last updated: ${day}, ${todayDate} ${month} ${year}`;
  // this will change the element I want into the current date

  // change the hours

  let currentHour = document.querySelector("#hours");
  let hours = now.getHours();

  if (hours < 10) {
    // If the hours are less than 10 (single digit)
    hours = `0${hours}`; // We prepend a leading zero to display two digits
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    // If the minutes are less than 10 (single digit)
    minutes = `0${minutes}`; // We prepend a leading zero to display two digits
  }

  currentHour.innerHTML = `${hours}:${minutes}`;
}
displayDate(now);
// This will ensure that the function is executed with the now date object as an argument, and the #current element will be updated with the current date.

// Having real time data for Lisbon as a default city

function fetchWeatherDataForDefaultCity() {
  let mainCity = (document.querySelector("#main").innerHTML = "Lisbon"); // Set the default city name to Lisbon
  let apiKey = "57b2c40fdae71a6ba41d72685e3226e2";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Lisbon&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(function (response) {
    handleResponse(response);
  });
}

// Add an event listener for the "load" event on the window object
window.addEventListener("load", fetchWeatherDataForDefaultCity);

// Challenge - Change the name in the main city and the temperature and the humidity and the wind to reflect the search input by the user

// Function to display the city and fetch weather data
function displayCity(event) {
  event.preventDefault(); // Prevents the form from submitting and refreshing the page
  let searchInput = document.querySelector("#search-text-input"); // Get the search input field
  let cityName = searchInput.value.trim(); // Get the trimmed value of the search inpu
  let mainCity = document.querySelector("#main");

  if (cityName) {
    // Check if the city name is not empty

    mainCity.innerHTML = cityName; // Update the main city name element with the entered city name

    // Call the function to fetch weather data
    fetchWeatherData(cityName);
  } else {
    mainCity.innerHTML = null; // Clear the main city name element
    alert(`Please, type a city`); // Show an alert if no city name is entered
  }
}

function handleResponse(response) {
  showTemperature(response); // Call the function to display temperature
  showDescription(response); // Call the function to display the description of the weather
  showHumidity(response); // Call the function to display temperature
  showWind(response); // Call the function to display temperature
  showIcon(response); // Call the function to display the weather icon
  getForecast(response.data.coord); // Call the function to display the coordinates and then get the weather forecast for the next days
}

// Function to fetch weather data
function fetchWeatherData(cityName) {
  let apiKey = "57b2c40fdae71a6ba41d72685e3226e2";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  axios
    .get(`${apiUrl}&appid=${apiKey}`) // Make a GET request to the weather API
    .then(function (response) {
      handleResponse(response);
    });
}

// Function to display temperature

function showDescription(response) {
  let description = response.data.weather[0].description;
  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = `${description}`;
}

function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#temperature");
  celsiusTemperature = response.data.main.temp; // this will also work with the conversion from celsius to fahrenheit function below
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

// Function to display humidity
function showHumidity(response) {
  let humidity = Math.round(response.data.main.humidity);
  let humidityElement = document.querySelector("#humidity-level");
  humidityElement.innerHTML = `Humidity: ${humidity}%`;
}

// Function to display wind speed

function showWind(response) {
  let wind = response.data.wind.speed;
  let windElement = document.querySelector("#wind-speed");
  windElement.innerHTML = `Wind: ${wind}m/h`;
}

function showIcon(response) {
  let iconElement = document.querySelector("#main-icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
}

// Get the search form element from the HTML and add a submit event listener with JavaScript

let searchForm = document.querySelector("#city-search");
searchForm.addEventListener("submit", displayCity);

// Geolocation button
// This function displays the temperature and other weather details for the current location
function showCurrentLocationTemperature(response) {
  let locationTemperature = Math.round(response.data.main.temp);

  let mainCityElement = document.querySelector("#main");
  mainCityElement.innerHTML = response.data.name; // Update the HTML element with the id "main" to display the city name
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = `${locationTemperature}`; // Update the HTML element with the id "temperature" to display the temperature
  let humidityElement = document.querySelector("#humidity-level");
  humidityElement.innerHTML = `Humidity: ${response.data.main.humidity}%`; // Update the HTML element with the id "humidity-level" to display the humidity
  let windElement = document.querySelector("#wind-speed");
  windElement.innerHTML = `Wind: ${response.data.wind.speed}km/h`; // Update the HTML element with the id "wind-speed" to display the wind speed
  getForecast(response.data.coord);
}
// This function is called when the device's current location is obtained
function showCurrentLocation(position) {
  // Extract the latitude and longitude from the position object
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "metric";
  let apiKey = "57b2c40fdae71a6ba41d72685e3226e2";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  // Send a GET request to the weather API and call showCurrentLocationTemperature with the response
  axios.get(apiUrl).then(showCurrentLocationTemperature);
}

// Select the HTML element with the id "current-location" to represent the current location button
let currentLocationButton = document.querySelector("#current-location");
// When the current location button is clicked, call the showCurrentLocation function
currentLocationButton.addEventListener("click", function () {
  // Ask the device for its current location and provide showCurrentLocation as the function to handle the location data
  navigator.geolocation.getCurrentPosition(showCurrentLocation);
});

// Convert Celsius temperature to Fahrenheit in the main city

function displayFahrenheitTemperature(event) {
  event.preventDefault(); // we do not want the link to open
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  // making the formula go back to celsius temperature
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}
let celsiusTemperature = null;
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

//Weather forecast: get the dates correctly displayed through a function, display the html we want through another function and populate it for the next days of the week

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    // condition to show only 4 days

    if (index < 5) {
      forecastHTML =
        forecastHTML +
        ` <div class="col-2">
        <div class="day">${formatDay(forecastDay.dt)}</div>
     
            <div class="weather-icon">
            <img src="https://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png"
            alt=""
            width="42"
            
         />
            
            </div>
                <span class="weather-forecast-min-temperature">${Math.round(
                  forecastDay.temp.min
                )}°C </span>
                |
                <span class="weather-forecast-max-temperature"> ${Math.round(
                  forecastDay.temp.max
                )}°C</span>
      </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//function to get the weather forecast for the following days and then call the displayForecast function to have it in HTML
function getForecast(coordinates) {
  let apiKey = "57b2c40fdae71a6ba41d72685e3226e2";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}
