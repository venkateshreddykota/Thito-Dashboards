import React from "react";
import { Link } from "react-router-dom"; // Import Link for routing

function Header() {
  return (
    <header className="header">
      <div className="logo">
      <img 
  src={`${process.env.PUBLIC_URL}/sais-digital-logo.png`} 
  alt="SAIS Logo" 
  style={{ width: "200px", height: "auto" }} 
/>
      </div>

      <h1 style={{ color: "white", fontSize: "24px", textAlign: "center" }}>
      </h1>

      <nav
  className="nav"
  style={{
    display: "flex",
    gap: "20px", // This sets equal space between items
  }}
>
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "18px",
            marginRight: "20px", // Add space to the right of each link
          }}
        >
          Home
        </Link>

         <Link
          to="/maindashboardbuttons"
          title="Click here to View The Dashboards For Thito Integrations"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "18px",
            marginRight: "20px", // Add space to the right of each link
          }}
        >
          Dashboards
        </Link>

      </nav>
    </header>
  );
}
export default Header;