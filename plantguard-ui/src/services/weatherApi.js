// // // // src/services/weatherApi.js
// // // const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// // // export const getWeather = async (lat, lon) => {
// // //   const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
// // //   try {
// // //     const res = await fetch(url);
// // //     const data = await res.json();
// // //     return {
// // //       temp: data.main.temp,
// // //       humidity: data.main.humidity,
// // //       rain: data.weather[0].main === "Rain",
// // //     };
// // //   } catch (err) {
// // //     console.error("Weather API Error:", err);
// // //     return null;
// // //   }
// // // };
// // // src/services/weatherApi.js
// // export const getWeather = async () => {
// //   try {
// //     const apiKey = import.meta.env.VITE_WEATHER_API_KEY; // from .env
// //     const city = "YourCity"; // replace with dynamic city if needed
// //     const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

// //     const res = await fetch(url);
// //     const data = await res.json();

// //     return {
// //       temp: data.main.temp,
// //       humidity: data.main.humidity,
// //       rain: data.weather.some(w => w.main.toLowerCase().includes("rain")),
// //     };
// //   } catch (err) {
// //     console.error("Weather API error:", err);
// //     return null;
// //   }
// // };

// ///////////&&&&&&&&&&
// // src/services/weatherApi.js
// // Supports: getWeather({ city }) OR getWeather({ lat, lon })
// // Returns: { temp, humidity, condition, description, rain, city, country }
// // Also includes a risk helper: getDiseaseRisk({ temp, humidity, rain })

// const BASE = "https://api.openweathermap.org/data/2.5/weather";

// export const getWeather = async ({ city, lat, lon } = {}) => {
//   try {
//     const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
//     if (!apiKey) {
//       console.error("Missing VITE_WEATHER_API_KEY in .env");
//       return null;
//     }

//     let url;
//     if (lat != null && lon != null) {
//       url = `${BASE}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
//     } else if (city) {
//       url = `${BASE}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
//     } else {
//       throw new Error("Provide either { city } or { lat, lon } to getWeather()");
//     }

//     const res = await fetch(url);
//     const data = await res.json();
//     if (!res.ok) {
//       console.error("Weather API error:", data);
//       return null;
//     }

//     const condition = (data.weather?.[0]?.main || "").toLowerCase();
//     const description = data.weather?.[0]?.description || "";
//     const isRain = condition.includes("rain") || (data.rain && (data.rain["1h"] || data.rain["3h"]));

//     return {
//       temp: data.main?.temp ?? null,
//       humidity: data.main?.humidity ?? null,
//       condition,        // e.g. "clouds", "rain", "clear"
//       description,      // e.g. "light rain"
//       rain: Boolean(isRain),
//       city: data.name || city || "",
//       country: data.sys?.country || "",
//     };
//   } catch (err) {
//     console.error("Weather API error:", err);
//     return null;
//   }
// };

// // Simple weather-based risk rules (tweak as you like)
// export const getDiseaseRisk = ({ temp, humidity, rain }) => {
//   // Base risk using humidity + rain
//   let score = 0;
//   if (rain) score += 2;            // rain strongly increases fungal risk
//   if (humidity >= 85) score += 2;
//   else if (humidity >= 70) score += 1;

//   // Temperature window sweet-spot for many fungal diseases (15–30°C)
//   if (temp >= 18 && temp <= 30) score += 1;

//   // Map to label + emoji
//   if (score >= 3) return { level: "High", msg: "⚠️ High risk of fungal spread." };
//   if (score === 2) return { level: "Moderate", msg: "☁️ Moderate disease risk." };
//   return { level: "Low", msg: "🌞 Low risk given current weather." };
// };


// src/services/weatherApi.js
const BASE = "https://api.openweathermap.org/data/2.5/weather";

export const getWeather = async ({ city, lat, lon } = {}) => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  if (!apiKey) { console.error("Missing VITE_WEATHER_API_KEY"); return null; }

  let url;
  if (lat != null && lon != null)
    url = `${BASE}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  else if (city)
    url = `${BASE}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  else
    throw new Error("Provide { city } or { lat, lon }");

  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) { console.error("Weather API error:", data); return null; }

  const condition = (data.weather?.[0]?.main || "").toLowerCase();
  const description = data.weather?.[0]?.description || "";
  const isRain = condition.includes("rain") || Boolean(data.rain && (data.rain["1h"] || data.rain["3h"]));

  return {
    temp: data.main?.temp ?? null,
    humidity: data.main?.humidity ?? null,
    wind: data.wind?.speed ?? null,
    condition,           // "clear", "clouds", "rain", "drizzle", "thunderstorm", "mist", "haze", "fog", "smoke", "sand", etc.
    description,
    rain: isRain,
    city: data.name || "",
    country: data.sys?.country || "",
  };
};

// Richer disease-risk heuristic (tweak freely)
export const getDiseaseRisk = ({ temp, humidity, rain, wind }) => {
  let score = 0, notes = [];

  if (rain) { score += 2; notes.push("Wet foliage increases fungal spread"); }
  if (humidity >= 90) { score += 2; notes.push("Very high humidity"); }
  else if (humidity >= 75) { score += 1; notes.push("High humidity"); }

  // Many foliar diseases thrive in 18–30°C
  if (temp >= 18 && temp <= 30) { score += 1; notes.push("Favorable temp range (18–30°C)"); }
  if (wind >= 8) { score += 1; notes.push("Wind may spread spores"); }

  let level, icon, msg;
  if (score >= 4) { level = "Very High"; icon = "🚨"; msg = "Very high risk of disease spread. Consider preventive spray."; }
  else if (score === 3) { level = "High"; icon = "⚠️"; msg = "High risk. Improve airflow, avoid overhead irrigation."; }
  else if (score === 2) { level = "Moderate"; icon = "🌥️"; msg = "Moderate risk. Monitor closely."; }
  else { level = "Low"; icon = "🌞"; msg = "Low risk given current weather."; }

  return { level, icon, msg, notes };
};
