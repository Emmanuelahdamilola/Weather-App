<<<<<<< HEAD
// ✅ Weather App — Fixed & Improved
=======
// ✅ Weather App with AI Outfit Suggestion & Weekly Summary
>>>>>>> 4da75103782e0cc8f5d392c9cb5bd4863fd9af50
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";

const searchInput = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

// Show current date
function displayDate() {
  const today = new Date();
<<<<<<< HEAD
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  document.querySelector(".date").innerHTML = today.toLocaleDateString("en-US", options);
}
displayDate();

// FIX: Check that config.js loaded and API key is set
function getApiKey() {
  if (!window.API_KEY || window.API_KEY === "YOUR_API_KEY_HERE") {
    showError("⚠️ API key not set. Please add your key in config.js");
    return null;
  }
  return window.API_KEY;
}

// FIX: Central error display helper with custom messages
function showError(message) {
  const errorEl = document.querySelector(".error p");
  errorEl.textContent = message || "Invalid city name";
  document.querySelector(".error").style.display = "block";
  document.querySelector(".weather-container").style.display = "none";
}

// FIX: Centralized icon mapper with fallback
function getWeatherIcon(condition) {
  const map = {
    Clouds: "images/clouds.png",
    Clear: "images/clear.png",
    Rain: "images/rain.png",
    Drizzle: "images/drizzle.png",
    Mist: "images/mist.png",
    Snow: "images/snow.png",
  };
  return map[condition] || "images/clear.png";
}

// Get weather for a city
async function fetchWeather(city) {
  const key = getApiKey();
  if (!key) return;

  try {
    const response = await fetch(`${apiUrl}${encodeURIComponent(city)}&appid=${key}`);

    // FIX: Handle all error status codes properly
    if (response.status === 404) {
      showError("City not found. Please check the spelling.");
      return;
    }
    if (response.status === 401) {
      showError("Invalid API key. Please update config.js.");
      return;
    }
    if (!response.ok) {
      showError("Something went wrong. Please try again.");
      return;
    }

    const data = await response.json();
    const cityName = data.name;
    const country = data.sys?.country || "";
=======
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  document.querySelector(".date").innerHTML = today.toLocaleDateString("en-US", options);
}

displayDate();

// Get weather for a city
async function fetchWeather(city) {
  const response = await fetch(`${apiUrl}${city}&appid=${window.API_KEY}`);

  if (response.status === 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather-container").style.display = "none";
  } else {
    const data = await response.json();
    const cityName = data.name;
>>>>>>> 4da75103782e0cc8f5d392c9cb5bd4863fd9af50
    const temp = Math.round(data.main.temp);
    const condition = data.weather[0].main;

    // Update DOM
<<<<<<< HEAD
    document.querySelector(".city").innerHTML = `${cityName}, <span class="country">${country}</span>`;
=======
    document.querySelector(".city").innerHTML = cityName;
>>>>>>> 4da75103782e0cc8f5d392c9cb5bd4863fd9af50
    document.querySelector(".temp").innerHTML = `${temp}°C`;
    document.querySelector(".feels").innerHTML = `Feels like ${Math.round(data.main.feels_like)}°`;
    document.querySelector(".description").innerHTML = data.weather[0].description;
    document.querySelector(".humidity").innerHTML = `${data.main.humidity}%`;
<<<<<<< HEAD
    document.querySelector(".wind").innerHTML = `${data.wind.speed} Km/h`;
    // FIX: Correct unit — OWM returns hPa, not Pa
    document.querySelector(".pressure").innerHTML = `${data.main.pressure} hPa`;

    weatherIcon.src = getWeatherIcon(condition);
=======
    document.querySelector(".wind").innerHTML = `${data.wind.speed}Km/h`;
    document.querySelector(".pressure").innerHTML = `${data.main.pressure}Pa`;

    if (condition === "Clouds") weatherIcon.src = "images/clouds.png";
    else if (condition === "Clear") weatherIcon.src = "images/clear.png";
    else if (condition === "Rain") weatherIcon.src = "images/rain.png";
    else if (condition === "Drizzle") weatherIcon.src = "images/drizzle.png";
    else if (condition === "Mist") weatherIcon.src = "images/mist.png";
>>>>>>> 4da75103782e0cc8f5d392c9cb5bd4863fd9af50

    document.querySelector(".weather-container").style.display = "block";
    document.querySelector(".error").style.display = "none";

<<<<<<< HEAD
    document.getElementById("outfitSuggestion").innerText = getOutfitSuggestion(temp, condition, cityName);

    // Fetch forecast for weekly summary
    try {
      const forecastResponse = await fetch(
        `${forecastApiUrl}${encodeURIComponent(city)}&units=metric&appid=${key}`
      );
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        document.getElementById("weeklySummary").innerText = generateWeeklySummary(forecastData.list, cityName);
      }
    } catch {
      document.getElementById("weeklySummary").innerText = "Weekly summary unavailable.";
    }
  } catch (err) {
    showError("Network error. Please check your connection.");
    console.error("fetchWeather error:", err);
  }
}

// FIX: Enter key now triggers search
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const city = searchInput.value.trim();
    if (city) fetchWeather(city);
  }
});

searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) fetchWeather(city);
});

// FIX: Default to a real city instead of a blank " " string
fetchWeather("Lagos");

// Sub-weather cards
// FIX: "Canada" (a country) replaced with "Toronto" (a real city)
async function updateSubWeatherCards() {
  const cities = ["Toronto", "Abuja"];
  const cards = document.querySelectorAll(".weather-content");
  const key = getApiKey();
  if (!key) return;

  for (let i = 0; i < cities.length; i++) {
    try {
      const response = await fetch(`${apiUrl}${encodeURIComponent(cities[i])}&appid=${key}`);
      if (!response.ok) continue;

      const data = await response.json();
      const card = cards[i];
      if (!card) continue;

      card.querySelector(".sub-temp").textContent = `${Math.round(data.main.temp)}°C`;
      card.querySelector(".location").textContent = data.name;
      card.querySelector(".sub-humidity").textContent = `${data.main.humidity}%`;
      card.querySelector(".sub-wind-speed").textContent = `${Math.round(data.wind.speed)} m/s`;
      // FIX: Consistent hPa label
      card.querySelector(".sub-pressure").textContent = `${data.main.pressure} hPa`;
      card.querySelector(".sub-weather-icon").src = getWeatherIcon(data.weather[0].main);
    } catch (err) {
      console.error(`Failed to fetch weather for ${cities[i]}:`, err);
    }
=======
    const outfitSuggestion = getOutfitSuggestion(temp, condition, cityName);
    document.getElementById("outfitSuggestion").innerText = outfitSuggestion;

    // Fetch forecast for weekly summary
    const forecastResponse = await fetch(`${forecastApiUrl}${city}&units=metric&appid=${window.API_KEY}`);
    const forecastData = await forecastResponse.json();
    document.getElementById("weeklySummary").innerText = generateWeeklySummary(forecastData.list, city);
  }
}

searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city !== "") fetchWeather(city);
});

fetchWeather(" ");

// Sub-weather cards for multiple cities
async function updateSubWeatherCards() {
  const cities = ["Canada", "Abuja"];
  const cards = document.querySelectorAll(".weather-content");

  for (let i = 0; i < cities.length; i++) {
    const response = await fetch(`${apiUrl}${cities[i]}&appid=${window.API_KEY}`);
    const data = await response.json();
    const card = cards[i];
    if (!card) continue;

    card.querySelector(".sub-temp").textContent = `${Math.round(data.main.temp)}°C`;
    card.querySelector(".location").textContent = data.name;
    card.querySelector(".sub-humidity").textContent = `${data.main.humidity}%`;
    card.querySelector(".sub-wind-speed").textContent = `${Math.round(data.wind.speed)} m/s`;
    card.querySelector(".sub-pressure").textContent = `${data.main.pressure} hPa`;

    const icon = card.querySelector(".sub-weather-icon");
    const weatherMain = data.weather[0].main;

    if (weatherMain === "Clouds") icon.src = "images/clouds.png";
    else if (weatherMain === "Clear") icon.src = "images/clear.png";
    else if (weatherMain === "Rain") icon.src = "images/rain.png";
    else if (weatherMain === "Drizzle") icon.src = "images/drizzle.png";
    else if (weatherMain === "Mist") icon.src = "images/mist.png";
    else if (weatherMain === "Snow") icon.src = "images/snow.png";
>>>>>>> 4da75103782e0cc8f5d392c9cb5bd4863fd9af50
  }
}

updateSubWeatherCards();

function getOutfitSuggestion(temp, condition, city) {
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
<<<<<<< HEAD
=======

>>>>>>> 4da75103782e0cc8f5d392c9cb5bd4863fd9af50
  let intro = `👕 AI Suggestion for ${city} this ${timeOfDay}: `;
  let advice = "";
  const c = condition.toLowerCase();

  if (c.includes("rain")) {
    advice = "Rain is likely — carry an umbrella and wear something waterproof. Avoid suede shoes. A native kaftan with a jacket works too.";
  } else if (c.includes("snow")) {
    advice = "It's snowy. Bundle up with a coat, gloves, and boots.";
  } else if (c.includes("clear") && temp >= 30) {
    advice = "Very hot and sunny — wear light cotton or short-sleeve Ankara. Use sunglasses and stay hydrated.";
  } else if (c.includes("clear") && temp < 18) {
    advice = "Sunny but chilly. A hoodie or long-sleeve native wear is ideal.";
  } else if (c.includes("cloud")) {
    advice = "Cloudy skies. Try a hoodie or long Ankara shirt with trousers.";
  } else {
    advice = "Weather seems moderate. Wear comfortable clothes and check for updates.";
  }

<<<<<<< HEAD
  if (timeOfDay === "evening" && temp < 20) advice += " It may get colder — carry a sweater or shawl.";
  else if (timeOfDay === "morning" && temp < 18) advice += " Mornings are cool — layer up before heading out.";
=======
  if (timeOfDay === "evening" && temp < 20) {
    advice += " It may get colder — carry a sweater or shawl.";
  } else if (timeOfDay === "morning" && temp < 18) {
    advice += " Mornings are cool — layer up before heading out.";
  }
>>>>>>> 4da75103782e0cc8f5d392c9cb5bd4863fd9af50

  return intro + advice;
}

function generateWeeklySummary(forecastList, city) {
  const days = forecastList.slice(0, 5).map((item) => {
    const day = new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "long" });
<<<<<<< HEAD
    const temp = Math.round(item.main?.temp ?? item.temp?.day ?? 0);
=======
    const temp = Math.round(item.main?.temp || item.temp?.day);
>>>>>>> 4da75103782e0cc8f5d392c9cb5bd4863fd9af50
    const condition = item.weather[0].main;
    return { day, temp, condition };
  });

<<<<<<< HEAD
  const temps = days.map((d) => d.temp);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
=======
  const temps = days.map(d => d.temp);
  const min = Math.min(...temps);
  const max = Math.max(...temps);

>>>>>>> 4da75103782e0cc8f5d392c9cb5bd4863fd9af50
  let summary = `Expect temperatures between ${min}°C and ${max}°C. `;

  const conditionFreq = days.reduce((acc, d) => {
    acc[d.condition] = (acc[d.condition] || 0) + 1;
    return acc;
  }, {});

  const [mostCommon] = Object.entries(conditionFreq).sort((a, b) => b[1] - a[1])[0] || [null];
<<<<<<< HEAD
  if (mostCommon) summary += `Mostly ${mostCommon.toLowerCase()} skies throughout the week. `;
=======
  if (mostCommon) {
    summary += `Mostly ${mostCommon.toLowerCase()} skies throughout the week. `;
  }

>>>>>>> 4da75103782e0cc8f5d392c9cb5bd4863fd9af50
  summary += `Pack accordingly — light outfits for sun, and layers for cloudy or rainy days.`;
  return summary;
}
