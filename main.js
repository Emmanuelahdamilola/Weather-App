
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchInput = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

function displayDate() {
  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);
  document.querySelector(".date").innerHTML = formattedDate;
}

displayDate();

// Fetching weather from API
async function fetchWeather(city) {
  const response = await fetch(`${apiUrl}${city}&appid=${API_KEY}`);

  // Display error message if response from API is not found, else display city weather
  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather-container").style.display = "none";
  } else {
    const data = await response.json();
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + "°C";
    document.querySelector(".feels").innerHTML =
      "Feels like " + Math.round(data.main.feels_like) + "°";
    document.querySelector(".description").innerHTML =
      data.weather[0].description;
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + "Km/h";
    document.querySelector(".pressure").innerHTML = data.main.pressure + "Pa";

    if (data.weather[0].main == "Clouds") {
      weatherIcon.src = "/images/clouds.png";
    } else if (data.weather[0].main == "Clear") {
      weatherIcon.src = "images/clear.png";
    } else if (data.weather[0].main == "Rain") {
      weatherIcon.src = "images/rain.png";
    } else if (data.weather[0].main == "Drizzle") {
      weatherIcon.src = "images/drizzle.png";
    } else if (data.weather[0].main == "Mist") {
      weatherIcon.src = "images/mist.png";
    }

    document.querySelector(".weather-container").style.display = "block";
    document.querySelector(".error").style.display = "none";
  }
}

searchBtn.addEventListener("click", () => {
  fetchWeather(searchInput.value);
});

fetchWeather();

async function updateSubWeatherCards() {
  let cities = ["canada", "Abuja"];

  // Get all weather cards
  const cards = document.querySelectorAll(".weather-content");

  for (let i = 0; i < cities.length; i++) {
    const response = await fetch(`${apiUrl}${cities[i]}&appid=${API_KEY}`);
    const data = await response.json();
    console.log(data);

    // Get the corresponding card
    const card = cards[i];

    if (!card) continue;

    card.querySelector(".sub-temp").textContent =
      Math.round(data.main.temp) + "°C";
    card.querySelector(".location").textContent = data.name;
    card.querySelector(".sub-humidity").textContent = data.main.humidity + "%";
    card.querySelector(".sub-wind-speed").textContent =
      Math.round(data.wind.speed) + " m/s";
    card.querySelector(".sub-pressure").textContent =
      data.main.pressure + " hPa";

    const icon = card.querySelector(".sub-weather-icon");
    const weatherMain = data.weather[0].main;

    if (weatherMain === "Clouds") icon.src = "images/clouds.png";
    else if (weatherMain === "Clear") icon.src = "images/clear.png";
    else if (weatherMain === "Rain") icon.src = "images/rain.png";
    else if (weatherMain === "Drizzle") icon.src = "images/drizzle.png";
    else if (weatherMain === "Mist") icon.src = "images/mist.png";
    else if (weatherMain === "Snow") icon.src = "images/snow.png";
  }
}

updateSubWeatherCards();
