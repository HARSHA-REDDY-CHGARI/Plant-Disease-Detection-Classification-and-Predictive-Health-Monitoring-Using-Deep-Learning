// // // import remediesData from "../data/remedies_seed.json";

// // // export function getRemediesByDisease(diseaseName) {
// // //   if (!diseaseName) return null;

// // //   const match = remediesData.find(
// // //     (item) =>
// // //       item.diseaseName.toLowerCase().replace(/\s/g, "") ===
// // //       diseaseName.toLowerCase().replace(/\s/g, "")
// // //   );

// // //   if (match) {
// // //     return {
// // //       diseaseName: match.diseaseName,
// // //       remedies: match.remedies,
// // //       pesticides: match.pesticides,
// // //     };
// // //   } else {
// // //     return {
// // //       diseaseName,
// // //       remedies: ["No specific remedies found."],
// // //       pesticides: ["No pesticide suggestions available."],
// // //     };
// // //   }
// // // }
// // import remediesData from "../data/remedies_seed.json";

// // // 🧠 Helper function to normalize both model labels and JSON names
// // function normalizeName(name) {
// //   return name
// //     .toLowerCase()
// //     .replace(/[_\s]+/g, "") // remove underscores and spaces
// //     .replace(/[^a-z0-9]/g, ""); // remove any special chars
// // }

// // export function getRemediesByDisease(diseaseName) {
// //   if (!diseaseName) return { remedies: [], pesticides: [] };

// //   const cleanName = normalizeName(diseaseName);

// //   const match = remediesData.find(
// //     (item) => normalizeName(item.diseaseName) === cleanName
// //   );

// //   if (match) {
// //     return {
// //       diseaseName: match.diseaseName,
// //       remedies: match.remedies,
// //       pesticides: match.pesticides,
// //     };
// //   } else {
// //     console.warn("⚠️ No remedies found for:", diseaseName);
// //     return {
// //       diseaseName,
// //       remedies: ["No specific remedies found."],
// //       pesticides: ["No pesticide suggestions available."],
// //     };
// //   }
// // }
// import remediesData from "../data/remedies_seed.json";

// function normalizeName(name = "") {
//   return name.toLowerCase().replace(/[^a-z0-9]/g, "");
// }

// export function getRemediesByDisease(diseaseName) {
//   if (!diseaseName) {
//     console.warn("⚠️ No disease name provided.");
//     return { remedies: [], pesticides: [] };
//   }

//   const cleanName = normalizeName(diseaseName);
//   console.log("🧠 Searching remedies for:", diseaseName, "→", cleanName);

//   // Try exact match first
//   let match = remediesData.find(
//     (item) => normalizeName(item.diseaseName) === cleanName
//   );

//   // If not found, try partial matching (useful if JSON differs slightly)
//   if (!match) {
//     match = remediesData.find((item) =>
//       normalizeName(item.diseaseName).includes(cleanName.slice(0, 10))
//     );
//   }

//   // If still not found, fallback
//   if (!match) {
//     console.warn("❌ No remedies found for:", diseaseName);
//     return {
//       remedies: ["No remedies found for this disease."],
//       pesticides: ["No pesticides available."],
//     };
//   }

//   console.log("✅ Match found for:", match.diseaseName);
//   return {
//     remedies: match.remedies || [],
//     pesticides: match.pesticides || [],
//   };
// }

import remediesData from "../data/remedies_seed.json";

export function getRemediesByDisease(diseaseName) {
  if (!diseaseName) return { remedies: [], pesticides: [] };

  const clean = diseaseName.trim().toLowerCase();
  const match = remediesData.find(
    (item) => item.diseaseName.trim().toLowerCase() === clean
  );

  if (match) {
    console.log("✅ Matched remedies for:", diseaseName);
    return { remedies: match.remedies, pesticides: match.pesticides };
  } else {
    console.warn("⚠️ No remedies found for:", diseaseName);
    return {
      remedies: ["No remedies found for this disease."],
      pesticides: ["No pesticides available."]
    };
  }
}
