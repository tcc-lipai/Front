import React from "react";
import "./index.css";
import medalhaImg from "../../assets/img/medalha.png";

const Conquistas = ({ title, subtitle, iconeUrl }) => {
  return (
    <div className="conquista-card">
      <div className="conquista-icon-container">
        <img
          src={iconeUrl || medalhaImg}
          alt={`Medalha da conquista ${title || "Semana Ouro"}`}
          className="conquista-icon-img"
          onError={(e) => {
            e.target.src = medalhaImg;
          }}
        />
      </div>

      <h3 className="conquista-title">{title || "Semana Ouro"}</h3>
      <p className="conquista-subtitle">{subtitle || "Semana Ouro"}</p>
    </div>
  );
};

export default Conquistas;
