
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload an image first!");
      return;
    }
    // Pass file to result page
    navigate("/result", { state: { file } });
  };

  return (
    <div className="home-container">
    <h2 className="text-2xl font-semibold text-green-700 flex items-center justify-center gap-2">
  <span>🌿</span>
  Detect Disease & Get Weather-Based Remedies
  <span>☀️💧🧬</span>
</h2>


      <form onSubmit={handleSubmit} className="upload-form">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Home;
