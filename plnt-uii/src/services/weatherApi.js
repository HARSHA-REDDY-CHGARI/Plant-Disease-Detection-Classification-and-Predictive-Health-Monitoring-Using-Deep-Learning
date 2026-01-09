// src/services/weatherApi.js
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function getWeather({ lat, lon, city }) {
  try {
    let url = "";
    if (lat && lon) {
      url = `${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    } else if (city) {
      url = `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`;
    } else {
      throw new Error("No location data provided");
    }

    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) throw new Error(data.message);

    return {
      city: data.name,
      temp: data.main.temp,
      humidity: data.main.humidity,
      wind: data.wind.speed,
      rain: data.rain ? Object.values(data.rain)[0] : 0,
      description: data.weather[0].description
    };
  } catch (err) {
    console.error("Weather API Error:", err);
    return null;
  }
}

// 🌿 Disease risk logic
export function getDiseaseRisk({ temp, humidity, rain, wind }) {
  let level = "Low";
  let icon = "🌞";
  let msg = "Favorable conditions; low risk of disease.";
  let notes = [];

  if (humidity > 80 || rain > 1) {
    level = "High";
    icon = "🌧️";
    msg = "High humidity and rain increase fungal disease risk.";
    notes.push("Avoid overhead watering.");
    notes.push("Spray preventive fungicides.");
  } else if (humidity > 60 || temp > 32) {
    level = "Moderate";
    icon = "🌤️";
    msg = "Warm, humid conditions may cause moderate disease risk.";
    notes.push("Monitor leaves for early signs of disease.");
  } else {
    notes.push("Maintain regular irrigation and soil nutrition.");
  }

  return { level, icon, msg, notes };
}
