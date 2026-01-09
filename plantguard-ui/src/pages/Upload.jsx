// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../services/firebase";

// export default function Upload() {
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const FAKE_PREDICTIONS = [
//     {
//       diseaseName: "Leaf Spot",
//       remedies: [
//         "Remove infected leaves immediately.",
//         "Avoid overhead watering and crowding of plants.",
//         "Apply neem oil every 7 days during humid weather.",
//       ],
//       pesticides: ["Mancozeb 1–2 g/L", "Copper oxychloride 0.75–1 ml/L"],
//     },
//     {
//       diseaseName: "Apple Black Rot",
//       remedies: [
//         "Prune infected twigs 15 cm below visible infection.",
//         "Destroy mummified fruit and debris.",
//         "Spray preventive fungicide before rainy season.",
//       ],
//       pesticides: ["Captan 2 g/L", "Thiophanate-methyl 1 g/L"],
//     },
//     {
//       diseaseName: "Tomato Early Blight",
//       remedies: [
//         "Remove lower infected leaves early.",
//         "Avoid working in wet fields.",
//         "Rotate crops with non-solanaceous plants.",
//         "Spray neem oil (3 ml/L) weekly.",
//       ],
//       pesticides: ["Chlorothalonil 2 g/L", "Mancozeb 2 g/L"],
//     },
//     {
//       diseaseName: "Potato Late Blight",
//       remedies: [
//         "Destroy infected tubers and debris after harvest.",
//         "Avoid excess nitrogen fertilizer.",
//       ],
//       pesticides: ["Metalaxyl + Mancozeb (1.25 g/L)", "Copper hydroxide (2.5 g/L)"],
//     },
//     {
//       diseaseName: "Corn Leaf Rust",
//       remedies: [
//         "Plant resistant varieties when available.",
//         "Ensure adequate spacing between rows.",
//       ],
//       pesticides: ["Propiconazole 0.5 ml/L", "Tebuconazole 0.75 ml/L"],
//     },
//     {
//       diseaseName: "Grape Downy Mildew",
//       remedies: [
//         "Avoid late evening irrigation.",
//         "Ensure good air circulation in canopy.",
//         "Remove old infected leaves regularly.",
//       ],
//       pesticides: ["Dimethomorph 1 ml/L", "Copper oxychloride 2 g/L"],
//     },
//     {
//       diseaseName: "Rice Blast",
//       remedies: [
//         "Avoid high nitrogen doses in wet season.",
//         "Drain field temporarily if water stagnates.",
//         "Apply potassium fertilizer for stronger leaves.",
//       ],
//       pesticides: ["Tricyclazole 0.6 g/L", "Isoprothiolane 1 ml/L"],
//     },
//   ];

//   const handleFileChange = (e) => {
//     const selected = e.target.files[0];
//     setFile(selected || null);
//     if (selected) {
//       const reader = new FileReader();
//       reader.onloadend = () => setPreview(reader.result);
//       reader.readAsDataURL(selected);
//     } else setPreview(null);
//   };

//   const handleUpload = async () => {
//     if (!file) return alert("Please select an image first!");
//     setLoading(true);

//     try {
//       const user = auth.currentUser;
//       if (!user) {
//         alert("Please login again.");
//         navigate("/", { replace: true });
//         return;
//       }

//       const randomPrediction =
//         FAKE_PREDICTIONS[Math.floor(Math.random() * FAKE_PREDICTIONS.length)];

//       const payload = { ...randomPrediction, imageUrl: preview };

//       sessionStorage.setItem("lastPrediction", JSON.stringify(payload));
//       navigate("/result", { state: payload });
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong during upload.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         display: "grid",
//         placeItems: "center",
//         height: "100vh",
//         background: "linear-gradient(135deg,#f0fdfa,#ecfdf5)",
//       }}
//     >
//       <div
//         style={{
//           background: "#fff",
//           padding: "32px 40px",
//           borderRadius: 16,
//           boxShadow: "0 6px 20px rgba(0,0,0,.1)",
//           width: 420,
//           textAlign: "center",
//         }}
//       >
//         <h2 style={{ color: "#15803d", marginBottom: 10 }}>Upload Leaf Image</h2>

//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleFileChange}
//           style={{
//             display: "block",
//             margin: "15px auto",
//             border: "1px solid #ccc",
//             borderRadius: 8,
//             padding: "8px 12px",
//             width: "100%",
//           }}
//         />

//         {preview && (
//           <div style={{ marginTop: 15, marginBottom: 20 }}>
//             <img
//               src={preview}
//               alt="Leaf Preview"
//               style={{
//                 width: 180,
//                 height: 180,
//                 objectFit: "cover",
//                 borderRadius: 12,
//                 boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
//                 border: "2px solid #a7f3d0",
//               }}
//             />
//           </div>
//         )}

//         <button
//           onClick={handleUpload}
//           disabled={loading}
//           style={{
//             background: "#16a34a",
//             color: "white",
//             border: "none",
//             borderRadius: 10,
//             padding: "12px 20px",
//             cursor: "pointer",
//             width: "100%",
//             fontSize: 15,
//             fontWeight: 500,
//           }}
//         >
//           {loading ? "Analyzing..." : "Predict Disease"}
//         </button>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const FAKE_PREDICTIONS = [
    {
      diseaseName: "Leaf Spot",
      remedies: [
        "Remove infected leaves immediately.",
        "Avoid overhead watering and crowding of plants.",
        "Apply neem oil every 7 days during humid weather.",
      ],
      pesticides: ["Mancozeb 1–2 g/L", "Copper oxychloride 0.75–1 ml/L"],
    },
    {
      diseaseName: "Apple Black Rot",
      remedies: [
        "Prune infected twigs 15 cm below visible infection.",
        "Destroy mummified fruit and debris.",
        "Spray preventive fungicide before rainy season.",
      ],
      pesticides: ["Captan 2 g/L", "Thiophanate-methyl 1 g/L"],
    },
    {
      diseaseName: "Tomato Early Blight",
      remedies: [
        "Remove lower infected leaves early.",
        "Avoid working in wet fields.",
        "Rotate crops with non-solanaceous plants.",
        "Spray neem oil (3 ml/L) weekly.",
      ],
      pesticides: ["Chlorothalonil 2 g/L", "Mancozeb 2 g/L"],
    },
    {
      diseaseName: "Potato Late Blight",
      remedies: [
        "Destroy infected tubers and debris after harvest.",
        "Avoid excess nitrogen fertilizer.",
      ],
      pesticides: ["Metalaxyl + Mancozeb (1.25 g/L)", "Copper hydroxide (2.5 g/L)"],
    },
    {
      diseaseName: "Corn Leaf Rust",
      remedies: [
        "Plant resistant varieties when available.",
        "Ensure adequate spacing between rows.",
      ],
      pesticides: ["Propiconazole 0.5 ml/L", "Tebuconazole 0.75 ml/L"],
    },
    {
      diseaseName: "Grape Downy Mildew",
      remedies: [
        "Avoid late evening irrigation.",
        "Ensure good air circulation in canopy.",
        "Remove old infected leaves regularly.",
      ],
      pesticides: ["Dimethomorph 1 ml/L", "Copper oxychloride 2 g/L"],
    },
    {
      diseaseName: "Rice Blast",
      remedies: [
        "Avoid high nitrogen doses in wet season.",
        "Drain field temporarily if water stagnates.",
        "Apply potassium fertilizer for stronger leaves.",
      ],
      pesticides: ["Tricyclazole 0.6 g/L", "Isoprothiolane 1 ml/L"],
    },
  ];

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected || null);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image first!");
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Please login again.");
        navigate("/", { replace: true });
        return;
      }

      const randomPrediction =
        FAKE_PREDICTIONS[Math.floor(Math.random() * FAKE_PREDICTIONS.length)];

      sessionStorage.setItem("lastPrediction", JSON.stringify(randomPrediction));
      navigate("/result", { state: randomPrediction });
    } catch (err) {
      console.error(err);
      alert("Something went wrong during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg,#f0fdfa,#ecfdf5)",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "32px 40px",
          borderRadius: 16,
          boxShadow: "0 6px 20px rgba(0,0,0,.1)",
          width: 420,
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#15803d", marginBottom: 10 }}>Upload Leaf Image</h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            display: "block",
            margin: "15px auto",
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: "8px 12px",
            width: "100%",
          }}
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            background: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: 10,
            padding: "12px 20px",
            cursor: "pointer",
            width: "100%",
            fontSize: 15,
            fontWeight: 500,
            marginTop: 10,
          }}
        >
          {loading ? "Analyzing..." : "Predict Disease"}
        </button>
      </div>
    </div>
  );
}
