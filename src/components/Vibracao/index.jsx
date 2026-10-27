import React from "react";
import "./index.css";

export default function Vibracao({ silaba = "Pa" }) {
  return (
    <div className="vibracao">
      <div className="vibracao__card">
        <span className="vibracao__texto">{silaba}</span>
      </div>
    </div>
  );
}
