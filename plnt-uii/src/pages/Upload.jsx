// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { predictDisease } from "../services/api";
// import { auth } from "../services/firebase";

// export default function Upload() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleFileChange = (e) => setFile(e.target.files[0] || null);

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

//       const result = await predictDisease(file);

//       navigate("/result", {
//         state: {
//           diseaseName: result.prediction,
//           confidence: result.confidence,
//           remedies: result.remedies || [],
//           pesticides: result.pesticides || []
//         }
//       });
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong while analyzing the image.");
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
//         background: "linear-gradient(135deg,#f0fdfa,#ecfdf5)"
//       }}
//     >
//       <div
//         style={{
//           background: "#fff",
//           padding: "32px 40px",
//           borderRadius: 16,
//           boxShadow: "0 6px 20px rgba(0,0,0,.1)",
//           width: 420,
//           textAlign: "center"
//         }}
//       >
//         <h2 style={{ color: "#15803d", marginBottom: 10 }}>
//           Upload Leaf Image
//         </h2>

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
//             width: "100%"
//           }}
//         />

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
//             marginTop: 10
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

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://127.0.0.1:5001/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Prediction failed");

      const data = await res.json();

      // ✅ Store in sessionStorage so refresh works
      sessionStorage.setItem("predictionData", JSON.stringify(data));

      navigate("/result", { state: data });
    } catch (error) {
      console.error(error);
      alert("Error predicting disease. Please check backend.");
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
        background: "linear-gradient(135deg,#e8fce8,#f0fff4)",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px 50px",
          borderRadius: 20,
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          width: 420,
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#166534", marginBottom: 20 }}>
          Upload Leaf Image
        </h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: "10px",
            width: "100%",
            marginBottom: 15,
          }}
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            background: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "12px 20px",
            cursor: "pointer",
            width: "100%",
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          {loading ? "Analyzing..." : "Predict Disease"}
        </button>
      </div>
    </div>
  );
}
