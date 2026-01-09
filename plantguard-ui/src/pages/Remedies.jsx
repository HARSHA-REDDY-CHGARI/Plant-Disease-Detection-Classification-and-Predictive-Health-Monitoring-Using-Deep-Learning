// src/pages/Remedies.jsx
import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Remedies() {
  const [remedies, setRemedies] = useState([]);

  useEffect(() => {
    const fetchRemedies = async () => {
      const querySnapshot = await getDocs(collection(db, "remedies"));
      const data = querySnapshot.docs.map(doc => doc.data());
      setRemedies(data);
    };
    fetchRemedies();
  }, []);

  return (
    <div className="remedies-container">
      <h2>Remedies & Pesticides</h2>
      {remedies.map((item, index) => (
        <div key={index} className="remedy-card">
          <h3>{item.diseaseName}</h3>
          <p><strong>Remedies:</strong> {item.remedies.join(", ")}</p>
          <p><strong>Pesticides:</strong> {item.pesticides.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}

