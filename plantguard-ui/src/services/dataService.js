import { db } from "./firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";

export const getRemediesByDisease = async (diseaseName) => {
  try {
    const q = query(collection(db, "remedies"), where("diseaseName", "==", diseaseName), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) return snap.docs[0].data();
  } catch (e) {
    console.error("Firestore remedies read error:", e);
  }
  return null;
};
