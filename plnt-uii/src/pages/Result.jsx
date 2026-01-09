// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// import WeatherCard from "./WeatherCard";

// import { getWeather, getDiseaseRisk } from "../services/weatherApi";  // ✅ correct path
// import { getRemediesByDisease } from "../services/dataService";       // ✅ if using remedies DB

// export default function Result() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { diseaseName, confidence, remedies, pesticides } = location.state || {};
//   const [weather, setWeather] = useState(null);
//   const [risk, setRisk] = useState(null);

//   useEffect(() => {
//     const loadWeather = async () => {
//       const setAll = (w) => {
//         setWeather(w);
//         setRisk(getDiseaseRisk({ temp: w.temp, humidity: w.humidity, rain: w.rain, wind: w.wind }));
//       };
//       try {
//         if (navigator.geolocation) {
//           navigator.geolocation.getCurrentPosition(
//             async (pos) => {
//               const w = await getWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude });
//               if (w) setAll(w);
//             },
//             async () => {
//               const w = await getWeather({ city: "Vellore" });
//               if (w) setAll(w);
//             }
//           );
//         } else {
//           const w = await getWeather({ city: "Vellore" });
//           if (w) setAll(w);
//         }
//       } catch (e) {
//         console.error(e);
//       }
//     };
//     loadWeather();
//   }, []);

//   if (!diseaseName) {
//     return (
//       <div className="result-page">
//         <div className="result-empty">No prediction found. Please upload an image first.</div>
//       </div>
//     );
//   }

//   return (
//     <div className="result-page">
//       <div className="result-shell">
//         <header className="result-header">
//           <div className="result-title">
//             <span className="result-title-icon">🌿</span>
//             <h1>Plant Disease Detection Result</h1>
//           </div>
//           {risk && (
//             <div className={`risk-chip ${risk.level.toLowerCase()}`}>
//               <span className="risk-emoji">{risk.icon}</span>
//               <span className="risk-text">{risk.level}</span>
//             </div>
//           )}
//         </header>

//         <div className="result-grid">
//           <section className="card card--left">
//             <h2 className="section-title">Disease Diagnosis</h2>

//             <div className="kv">
//               <div className="kv-key">Disease</div>
//               <div className="kv-val">{diseaseName}</div>
//             </div>

//             {/* {confidence && (
//               <div className="kv">
//                 <div className="kv-key">Confidence</div>
//                 <div className="kv-val">{confidence.toFixed(2)}%</div>
//               </div>
//             )} */}

//             <div className="section">
//               <div className="section-subtitle">Remedies</div>
//               <ul className="list">
//                 {remedies?.map((r, i) => (
//                   <li key={i}>{r}</li>
//                 ))}
//               </ul>
//             </div>

//             <div className="section">
//               <div className="section-subtitle">Pesticides</div>
//               <ul className="list">
//                 {pesticides?.map((p, i) => (
//                   <li key={i}>{p}</li>
//                 ))}
//               </ul>
//             </div>

//             {risk && (
//               <div className="risk-note">
//                 <b>{risk.level}</b> — {risk.msg}
//                 <ul className="list list--notes">
//                   {risk.notes.map((n, idx) => (
//                     <li key={idx}>{n}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             <div className="actions">
//               <button className="btn-primary" onClick={() => navigate("/upload")}>
//                 Upload Another Image
//               </button>
//             </div>
//           </section>

//           <aside className="card card--right">
//             {weather && (
//               <WeatherCard
//                 temp={weather.temp}
//                 humidity={weather.humidity}
//                 rain={weather.rain}
//                 wind={weather.wind}
//                 city={weather.city}
//                 description={weather.description}
//               />
//             )}
//           </aside>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WeatherCard from "../../../plnt-uii/src/pages/WeatherCard";
import { getWeather, getDiseaseRisk } from "../services/weatherApi";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { prediction, confidence } = location.state || {};

  const [weather, setWeather] = useState(null);
  const [risk, setRisk] = useState(null);

  // 🌿 Fallback Remedies (5 options)
  const FALLBACK_REMEDIES = [
    "Remove infected leaves and maintain field cleanliness.",
    "Avoid overhead watering and improve air circulation.",
    "Apply organic compost to boost plant immunity.",
    "Disinfect garden tools after every use to prevent spread.",
    "Ensure proper spacing between plants for ventilation."
  ];

  // 🌿 Fallback Pesticides (5 options)
  const FALLBACK_PESTICIDES = [
    "Mancozeb (2 g/L) — broad-spectrum fungicide for leaf protection.",
    "Copper oxychloride (2.5 g/L) — effective against bacterial and fungal diseases.",
    "Chlorothalonil (2 g/L) — preventive fungicide used under humid conditions.",
    "Azoxystrobin (0.5 ml/L) — systemic control for multiple fungal infections.",
  ];

  // 🧠 Helper to pick 2–3 random unique items
  const pickRandomItems = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.3 - Math.random());
    return shuffled.slice(0, count);
  };

  // 🌦️ Weather fetching
  useEffect(() => {
    const loadWeather = async () => {
      const setAll = (w) => {
        setWeather(w);
        setRisk(
          getDiseaseRisk({
            temp: w.temp,
            humidity: w.humidity,
            rain: w.rain,
            wind: w.wind,
          })
        );
      };
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const w = await getWeather({
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
              });
              if (w) setAll(w);
            },
            async () => {
              const w = await getWeather({ city: "Vellore" });
              if (w) setAll(w);
            }
          );
        } else {
          const w = await getWeather({ city: "Vellore" });
          if (w) setAll(w);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadWeather();
  }, []);

  if (!prediction) {
    return (
      <div className="result-page">
        <div className="result-empty">
          No prediction found. Please upload an image first.
        </div>
      </div>
    );
  }

  const isHealthy = prediction.toLowerCase().includes("healthy");

  // ✅ If diseased → random 2–3 fallbacks
  const displayRemedies = isHealthy ? [] : pickRandomItems(FALLBACK_REMEDIES, 3);
  const displayPesticides = isHealthy ? [] : pickRandomItems(FALLBACK_PESTICIDES, 3);

  return (
    <div className="result-page">
      <div className="result-shell">
        <header className="result-header">
          <div className="result-title">
            <span className="result-title-icon">🌿</span>
            <h1>Plant Disease Detection Result</h1>
          </div>

          {risk && (
            <div className={`risk-chip ${risk.level.toLowerCase()}`}>
              <span className="risk-emoji">{risk.icon}</span>
              <span className="risk-text">{risk.level}</span>
            </div>
          )}
        </header>

        <div className="result-grid">
          <section className="card card--left">
            <h2 className="section-title">Disease Diagnosis</h2>

            <div className="kv">
              <div className="kv-key">Disease</div>
              <div className="kv-val">{prediction.replaceAll("_", " ")}</div>
            </div>

            {/* {confidence && (
              <div className="kv">
                <div className="kv-key">Confidence</div>
                <div className="kv-val">{confidence.toFixed(2)}%</div>
              </div>
            )} */}

            {isHealthy ? (
              <div
                style={{
                  marginTop: "20px",
                  padding: "12px",
                  borderRadius: "10px",
                  background: "#d1fae5",
                  color: "#065f46",
                  textAlign: "center",
                }}
              >
                ✅ The plant is healthy. No remedies or pesticides required.
              </div>
            ) : (
              <>
                <div className="section">
                  <div className="section-subtitle">Remedies</div>
                  <ul className="list">
                    {displayRemedies.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="section">
                  <div className="section-subtitle">Pesticides</div>
                  <ul className="list">
                    {displayPesticides.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {risk && (
              <div className="risk-note">
                <b>{risk.level}</b> — {risk.msg}
                <ul className="list list--notes">
                  {risk.notes.map((n, idx) => (
                    <li key={idx}>{n}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="actions">
              <button className="btn-primary" onClick={() => navigate("/upload")}>
                Upload Another Image
              </button>
            </div>
          </section>

          <aside className="card card--right">
            {weather && (
              <WeatherCard
                temp={weather.temp}
                humidity={weather.humidity}
                rain={weather.rain}
                wind={weather.wind}
                city={weather.city}
                description={weather.description}
              />
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
