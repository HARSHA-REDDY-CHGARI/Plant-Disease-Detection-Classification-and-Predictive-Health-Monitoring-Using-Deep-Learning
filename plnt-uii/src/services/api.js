// // src/services/api.js
// import { predictDisease } from "../services/api";
// export const backendURL = "http://127.0.0.1:5001";

// export async function predictDisease(file) {
//   const formData = new FormData();
//   formData.append("file", file);

//   try {
//     const res = await fetch(`${backendURL}/predict`, {
//       method: "POST",
//       body: formData
//     });

//     if (!res.ok) throw new Error("Server error");
//     const data = await res.json();
//     console.log("✅ Flask Prediction Response:", data);
//     return data;
//   } catch (err) {
//     console.error("❌ Prediction API Error:", err);
//     throw err;
//   }
// }

// src/services/api.js

export async function predictDisease(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    // 🧠 Use your local Flask backend address
    const response = await fetch("http://127.0.0.1:5001/predict", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Prediction failed. Please try again.");
    }

    const data = await response.json();
    return data; // { class: "Tomato___Early_blight", confidence: 0.94 }
  } catch (error) {
    console.error("Error during prediction:", error);
    throw error;
  }
}
