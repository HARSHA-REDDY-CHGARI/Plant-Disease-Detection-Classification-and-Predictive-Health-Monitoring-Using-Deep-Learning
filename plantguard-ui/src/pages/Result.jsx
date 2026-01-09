// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import WeatherCard from "./pages/WeatherCard";
// import { getWeather, getDiseaseRisk } from "./services/weatherApi";

// const styles = {
//   page: {
//     minHeight: "100vh",
//     background: "linear-gradient(135deg,#f0fdfa,#e0f7fa)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: "20px",
//   },
//   container: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     gap: "24px",
//     width: "90%",
//     maxWidth: "950px",
//     background: "#fff",
//     padding: "32px",
//     borderRadius: "20px",
//     boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
//   },
//   left: {
//     flex: 1.2,
//   },
//   right: {
//     flex: 0.8,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   heading: {
//     fontSize: "26px",
//     fontWeight: 700,
//     color: "#14532d",
//     marginBottom: "10px",
//   },
//   section: {
//     background: "#f8fafc",
//     padding: "16px 20px",
//     borderRadius: "12px",
//     marginBottom: "14px",
//   },
//   label: { fontWeight: 700, color: "#166534", marginBottom: "6px" },
//   list: { marginTop: "6px", marginLeft: "20px" },
//   risk: {
//     fontWeight: 600,
//     marginTop: "10px",
//     color: "#1e293b",
//   },
//   backButton: {
//     marginTop: "20px",
//     background: "#16a34a",
//     color: "#fff",
//     border: "none",
//     padding: "10px 20px",
//     borderRadius: "10px",
//     cursor: "pointer",
//     fontSize: "15px",
//     fontWeight: 500,
//   },
// };

// export default function Result() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [weather, setWeather] = useState(null);
//   const [risk, setRisk] = useState(null);

//   const data =
//     location.state ||
//     JSON.parse(sessionStorage.getItem("lastPrediction")) || {
//       diseaseName: "Unknown Disease",
//       remedies: [],
//       pesticides: [],
//     };

//   useEffect(() => {
//     const loadWeather = async () => {
//       const w = await getWeather({ city: "Vellore" });
//       if (w) {
//         setWeather(w);
//         setRisk(getDiseaseRisk(w));
//       }
//     };
//     loadWeather();
//   }, []);

//   return (
//     <div style={styles.page}>
//       <div style={styles.container}>
//         {/* Left column */}
//         <div style={styles.left}>
//           <h2 style={styles.heading}>🌿 Disease Detection Result</h2>

//           <div style={styles.section}>
//             <p>
//               <span style={styles.label}>Disease:</span> {data.diseaseName}
//             </p>
//           </div>

//           <div style={styles.section}>
//             <p style={styles.label}>Remedies:</p>
//             <ul style={styles.list}>
//               {data.remedies?.length ? (
//                 data.remedies.map((r, i) => <li key={i}>{r}</li>)
//               ) : (
//                 <li>No remedies found.</li>
//               )}
//             </ul>
//           </div>

//           <div style={styles.section}>
//             <p style={styles.label}>Pesticides:</p>
//             <ul style={styles.list}>
//               {data.pesticides?.length ? (
//                 data.pesticides.map((p, i) => <li key={i}>{p}</li>)
//               ) : (
//                 <li>No pesticides found.</li>
//               )}
//             </ul>
//           </div>

//           {risk && (
//             <div style={styles.section}>
//               <p style={styles.label}>Weather-based Risk:</p>
//               <p style={styles.risk}>
//                 {risk.icon} {risk.level} — {risk.msg}
//               </p>
//               {risk.notes?.length ? (
//                 <ul style={styles.list}>
//                   {risk.notes.map((note, idx) => (
//                     <li key={idx}>{note}</li>
//                   ))}
//                 </ul>
//               ) : null}
//             </div>
//           )}

//           <button style={styles.backButton} onClick={() => navigate("/upload")}>
//             ← Upload Another Image
//           </button>
//         </div>

//         {/* Right column */}
//         <div style={styles.right}>
//           {weather && (
//             <WeatherCard
//               temp={weather.temp}
//               humidity={weather.humidity}
//               rain={weather.rain}
//               wind={weather.wind}
//               city={weather.city}
//               description={weather.description}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
//////////////////////
// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import WeatherCard from "./WeatherCard";
// import { getWeather, getDiseaseRisk } from "../services/weatherApi";
// import { getRemediesByDisease } from "../services/dataService";

// const styles = {
//   page: {
//     minHeight: "100vh",
//     background: "linear-gradient(180deg,#e8fbf0 0%, #eaf6fa 100%)",
//     padding: "40px 16px",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   wrap: {
//     width: "min(950px, 95vw)",
//     display: "flex",
//     gap: 24,
//     alignItems: "stretch",
//   },
//   leftCard: {
//     flex: 1.4,
//     background: "#fff",
//     borderRadius: 16,
//     boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
//     padding: 24,
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-between",
//   },
//   rightCard: {
//     flex: 1,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   label: { fontWeight: 700, color: "#1e293b" },
//   list: { margin: "8px 0 0 18px" },
//   riskRow: { marginTop: 12, fontWeight: 600, color: "#0f172a" },
//   button: {
//     marginTop: 20,
//     background: "#16a34a",
//     color: "white",
//     border: "none",
//     padding: "10px 18px",
//     borderRadius: 8,
//     cursor: "pointer",
//     fontWeight: 600,
//     alignSelf: "center",
//   },
// };

// export default function Result() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { diseaseName, remedies, pesticides } = location.state || {};

//   const [weather, setWeather] = useState(null);
//   const [risk, setRisk] = useState(null);

//   // Load weather on mount
//   useEffect(() => {
//     const loadWeather = async () => {
//       const setAll = (w) => {
//         setWeather(w);
//         setRisk(
//           getDiseaseRisk({
//             temp: w.temp,
//             humidity: w.humidity,
//             rain: w.rain,
//             wind: w.wind,
//           })
//         );
//       };
//       try {
//         if (navigator.geolocation) {
//           navigator.geolocation.getCurrentPosition(
//             async (pos) => {
//               const w = await getWeather({
//                 lat: pos.coords.latitude,
//                 lon: pos.coords.longitude,
//               });
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
//       } catch (err) {
//         console.error("Weather load failed", err);
//       }
//     };
//     loadWeather();
//   }, []);

//   if (!diseaseName) {
//     return (
//       <div style={styles.page}>
//         <div style={{ color: "#475569", fontSize: 20 }}>
//           No prediction found. Please upload an image first.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.page}>
//       <div style={styles.wrap}>
//         {/* Left side: Disease info */}
//         <div style={styles.leftCard}>
//           <div>
//             <h2
//               style={{
//                 fontSize: 24,
//                 color: "#166534",
//                 marginBottom: 10,
//                 textAlign: "center",
//               }}
//             >
//               🌿 Disease Diagnosis
//             </h2>
//             <p>
//               <span style={styles.label}>Disease:</span> {diseaseName}
//             </p>

//             <div style={{ marginTop: 12 }}>
//               <p style={styles.label}>Remedies:</p>
//               <ul style={styles.list}>
//                 {remedies?.map((r, i) => (
//                   <li key={i}>{r}</li>
//                 ))}
//               </ul>
//             </div>

//             <div style={{ marginTop: 12 }}>
//               <p style={styles.label}>Pesticides:</p>
//               <ul style={styles.list}>
//                 {pesticides?.map((p, i) => (
//                   <li key={i}>{p}</li>
//                 ))}
//               </ul>
//             </div>

//             {risk && (
//               <div style={styles.riskRow}>
//                 <span>{risk.icon}</span> <b>{risk.level}</b> — {risk.msg}
//                 {risk.notes?.length ? (
//                   <ul style={{ ...styles.list, marginTop: 6 }}>
//                     {risk.notes.map((n, idx) => (
//                       <li key={idx} style={{ fontWeight: 400 }}>
//                         {n}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : null}
//               </div>
//             )}
//           </div>

//           <button style={styles.button} onClick={() => navigate("/upload")}>
//             Upload Another Image
//           </button>
//         </div>

//         {/* Right side: Weather card */}
//         <div style={styles.rightCard}>
//           {weather && (
//             <WeatherCard
//               temp={weather.temp}
//               humidity={weather.humidity}
//               rain={weather.rain}
//               wind={weather.wind}
//               city={weather.city}
//               description={weather.description}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WeatherCard from "./WeatherCard";
import { getWeather, getDiseaseRisk } from "../services/weatherApi";
import { getRemediesByDisease } from "../services/dataService";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { diseaseName, remedies, pesticides } = location.state || {};

  const [weather, setWeather] = useState(null);
  const [risk, setRisk] = useState(null);

  useEffect(() => {
    const loadWeather = async () => {
      const setAll = (w) => {
        setWeather(w);
        setRisk(getDiseaseRisk({ temp: w.temp, humidity: w.humidity, rain: w.rain, wind: w.wind }));
      };
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const w = await getWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude });
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

  if (!diseaseName) {
    return (
      <div className="result-page">
        <div className="result-empty">No prediction found. Please upload an image first.</div>
      </div>
    );
  }

  return (
    <div className="result-page">
      <div className="result-shell">
        <header className="result-header">
          <div className="result-title">
            <span className="result-title-icon">🌿</span>
            <h1>Plant Disease Detection Result</h1>
          </div>
          <div className={`risk-chip ${risk?.level?.toLowerCase() || "low"}`}>
            <span className="risk-emoji">{risk?.icon || "🌞"}</span>
            <span className="risk-text">{risk?.level || "Low"}</span>
          </div>
        </header>

        <div className="result-grid">
          {/* Left: Disease details */}
          <section className="card card--left">
            <h2 className="section-title">
              <span className="section-dot" />
              Disease Diagnosis
            </h2>

            <div className="kv">
              <div className="kv-key">Disease</div>
              <div className="kv-val">{diseaseName}</div>
            </div>

            <div className="section">
              <div className="section-subtitle">Remedies</div>
              <ul className="list">
                {remedies?.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="section">
              <div className="section-subtitle">Pesticides</div>
              <ul className="list">
                {pesticides?.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            {risk && (
              <div className="risk-note">
                <b>{risk.level}</b> — {risk.msg}
                {risk.notes?.length ? (
                  <ul className="list list--notes">
                    {risk.notes.map((n, idx) => (
                      <li key={idx}>{n}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )}

            <div className="actions">
              <button className="btn-primary" onClick={() => navigate("/upload")}>
                Upload Another Image
              </button>
            </div>
          </section>

          {/* Right: Weather */}
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
