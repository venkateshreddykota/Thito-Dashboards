// EbsDashboard.js
import React from "react";

const EbsDashboard = () => {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    // background: "linear-gradient(to right,rgb(191, 203, 213), #00f2fe)",
    margin: "0",
    padding: "0",
  };

  const contentStyle = {
    textAlign: "center",
    padding: "40px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "80%",
    maxWidth: "900px",
  };

  const titleStyle = {
    fontSize: "50px",
    fontWeight: "bold",
    // color: "#fff",
    color:"#04294e",
    
    marginBottom: "20px",
  };
  const descriptionStyle = {
    fontSize: "20px",
    color: "#000", // Set description text color to black
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>EBS Integration Dashboard</h1>
        <p style={descriptionStyle}>
          Monitoring-EBS integrations
        </p>
      </div>
    </div>
  );
};
export default EbsDashboard;