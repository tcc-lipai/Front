import React from "react";
import "./index.css";

export default function Vibracao({ silaba = "Pa" }) {
  return (
    <div className="container">
      <div className="card">
        <span className="text">{silaba}</span>
      </div>
    </div>
  );
}
