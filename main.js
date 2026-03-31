
const searchInput = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

// Show current date
function displayDate() {
  const today = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  document.querySelector(".date").innerHTML = today.toLocaleDateString("en-US", options);
}
displayDate();

// Central error display
function showError(message) {
  const errorEl = document.querySelector(".error p");
  errorEl.textContent = message || "Invalid city name";
  document.querySelector(".error").style.display = "block";
  document.querySelector(".weather-container").style.display = "none";
}

// Centralized icon mapper with fallback
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

// Fetch weather for a city via Vercel serverless function
async function fetchWeather(city) {
  try {
    const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);

    if (res.status === 404) { showError("City not found. Please check the spelling."); return; }
    if (res.status === 401) { showError("Invalid API key. Please set it in Vercel environment variables."); return; }
    if (!res.ok) { showError("Something went wrong. Please try again."); return; }

    const data = await res.json();
    const cityName = data.name;
    const country = data.sys?.country || "";
    const temp = Math.round(data.main.temp);
    const condition = data.weather[0].main;

    document.querySelector(".city").innerHTML = `${cityName}, <span class="country">${country}</span>`;
    document.querySelector(".temp").innerHTML = `${temp}°C`;
    document.querySelector(".feels").innerHTML = `Feels like ${Math.round(data.main.feels_like)}°`;
    document.querySelector(".description").innerHTML = data.weather[0].description;
    document.querySelector(".humidity").innerHTML = `${data.main.humidity}%`;
    document.querySelector(".wind").innerHTML = `${data.wind.speed} Km/h`;
    document.querySelector(".pressure").innerHTML = `${data.main.pressure} hPa`;

    weatherIcon.src = getWeatherIcon(condition);
    document.querySelector(".weather-container").style.display = "block";
    document.querySelector(".error").style.display = "none";

    document.getElementById("outfitSuggestion").innerText = getOutfitSuggestion(temp, condition, cityName);

  } catch (err) {
    showError("Network error. Please check your connection.");
    console.error("fetchWeather error:", err);
    return;
  }

  // Forecast fetch in its own try block to avoid variable redeclaration
  try {
    const forecastRes = await fetch(`/api/weather?city=${encodeURIComponent(city)}&type=forecast`);
    if (forecastRes.ok) {
      const forecastData = await forecastRes.json();
      document.getElementById("weeklySummary").innerText = generateWeeklySummary(forecastData.list, city);
    }
  } catch {
    document.getElementById("weeklySummary").innerText = "Weekly summary unavailable.";
  }
}

// Enter key triggers search
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

// Default city on load
fetchWeather("Lagos");

// Sub-weather cards for Toronto and Abuja
async function updateSubWeatherCards() {
  const cities = ["Toronto", "Abuja"];
  const cards = document.querySelectorAll(".weather-content");

  for (let i = 0; i < cities.length; i++) {
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(cities[i])}`);
      if (!res.ok) continue;

      const data = await res.json();
      const card = cards[i];
      if (!card) continue;

      card.querySelector(".sub-temp").textContent = `${Math.round(data.main.temp)}°C`;
      card.querySelector(".location").textContent = data.name;
      card.querySelector(".sub-humidity").textContent = `${data.main.humidity}%`;
      card.querySelector(".sub-wind-speed").textContent = `${Math.round(data.wind.speed)} m/s`;
      card.querySelector(".sub-pressure").textContent = `${data.main.pressure} hPa`;
      card.querySelector(".sub-weather-icon").src = getWeatherIcon(data.weather[0].main);
    } catch (err) {
      console.error(`Failed to fetch weather for ${cities[i]}:`, err);
    }
  }
}

updateSubWeatherCards();

function getOutfitSuggestion(temp, condition, city) {
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
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

  if (timeOfDay === "evening" && temp < 20) advice += " It may get colder — carry a sweater or shawl.";
  else if (timeOfDay === "morning" && temp < 18) advice += " Mornings are cool — layer up before heading out.";

  return intro + advice;
}

function generateWeeklySummary(forecastList, city) {
  const days = forecastList.slice(0, 5).map((item) => {
    const day = new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "long" });
    const temp = Math.round(item.main?.temp ?? item.temp?.day ?? 0);
    const condition = item.weather[0].main;
    return { day, temp, condition };
  });

  const temps = days.map((d) => d.temp);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  let summary = `Expect temperatures between ${min}°C and ${max}°C. `;

  const conditionFreq = days.reduce((acc, d) => {
    acc[d.condition] = (acc[d.condition] || 0) + 1;
    return acc;
  }, {});

  const [mostCommon] = Object.entries(conditionFreq).sort((a, b) => b[1] - a[1])[0] || [null];
  if (mostCommon) summary += `Mostly ${mostCommon.toLowerCase()} skies throughout the week. `;

  summary += `Pack accordingly — light outfits for sun, and layers for cloudy or rainy days.`;
  return summary;
}