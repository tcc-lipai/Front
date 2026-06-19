import React from "react";
import "./index.css";

function Navbar() {
  const voltar = () => {
    window.history.back();
  };

  return (
    <nav className="navbar">
      <button className="navbar-btn" onClick={voltar}>
        ←
      </button>
    </nav>
  );
}

export default Navbar;