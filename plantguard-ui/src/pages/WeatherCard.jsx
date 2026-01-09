// // // src/components/WeatherCard.jsx
// // import React from "react";

// // const WeatherCard = ({ temp, humidity, rain }) => {
// //   return (
// //     <div style={{
// //       border: "1px solid #ccc",
// //       borderRadius: "10px",
// //       padding: "20px",
// //       maxWidth: "200px",
// //       textAlign: "center",
// //       backgroundColor: "#f0f8ff",
// //       boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
// //       margin: "10px auto"
// //     }}>
// //       <h3>Weather Info</h3>
// //       <p>Temperature: {temp} °C</p>
// //       <p>Humidity: {humidity} %</p>
// //       <p>{rain ? "Rain: Yes" : "Rain: No"}</p>
// //     </div>
// //   );
// // };

// // export default WeatherCard;


// import React from "react";

// const WeatherCard = ({ temp, humidity, rain, wind, city, description }) => {
//   return (
//     <div style={{
//       width: 290,
//       textAlign: "center",
//       background: "#ffffff",
//       borderRadius: 18,
//       padding: "18px 16px",
//       boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
//       border: "1px solid #ecf0f4"
//     }}>
//       <h3 style={{margin: 0, fontSize: 18}}>Weather Info</h3>
//       <div style={{marginTop: 8, color:"#64748b"}}>
//         <div style={{fontSize:14}}>{description}{city ? ` (${city})` : ""}</div>
//       </div>
//       <div style={{marginTop: 10, lineHeight: 1.8}}>
//         <div><b>Temperature:</b> {temp?.toFixed ? temp.toFixed(1) : temp} °C</div>
//         <div><b>Humidity:</b> {humidity} %</div>
//         <div><b>Wind:</b> {wind ?? "—"} m/s</div>
//         <div><b>Rain:</b> {rain ? "Yes" : "No"}</div>
//       </div>
//     </div>
//   );
// };

// export default WeatherCard;

import React from "react";

export default function WeatherCard({ temp, humidity, rain, wind, city, description, compact = false }) {
  const W = compact ? 240 : 290;
  const pad = compact ? 12 : 18;
  const title = compact ? 16 : 18;
  const line = compact ? 13 : 14;

  return (
    <div
      style={{
        width: W,
        textAlign: "center",
        background: "#ffffff",
        borderRadius: 14,
        padding: `${pad}px ${pad - 2}px`,
        boxShadow: "0 10px 20px rgba(0,0,0,0.07)",
        border: "1px solid #ecf0f4",
      }}
    >
      <h3 style={{ margin: 0, fontSize: title, color: "#166534" }}>Weather Info</h3>
      <div style={{ marginTop: 6, color: "#64748b", fontSize: line }}>
        {description}
        {city ? ` (${city})` : ""}
      </div>
      <div style={{ marginTop: 8, lineHeight: 1.6, fontSize: line, color: "#0f172a" }}>
        <div>
          <b>Temperature:</b> {temp?.toFixed ? temp.toFixed(1) : temp} °C
        </div>
        <div>
          <b>Humidity:</b> {humidity} %
        </div>
        <div>
          <b>Wind:</b> {wind ?? "—"} m/s
        </div>
        <div>
          <b>Rain:</b> {rain ? "Yes" : "No"}
        </div>
      </div>
    </div>
  );
}
