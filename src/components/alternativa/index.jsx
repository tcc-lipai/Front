import React from "react";
import "./index.css";

export default function Alternativa({ 
  options, 
  selectedOption, 
  status, 
  correctOptionId, 
  onSelect 
}) {
  return (
    <div className="options-list">
      {options.map((option) => {
        let optionClass = "option-item";

        // Aplica as classes baseadas no status vindo da tela principal
        if (status === "selected" && selectedOption === option.id) {
          optionClass += " selected";
        } else if (status === "responded") {
          if (option.id === correctOptionId) {
            optionClass += " correct";
          } else if (selectedOption === option.id && option.id !== correctOptionId) {
            optionClass += " incorrect";
          }
        }

        return (
          <button
            key={option.id}
            className={optionClass}
            onClick={() => onSelect(option.id)}
            disabled={status === "responded"}
          >
            <span className="option-letter">{option.id})</span> {option.text}
          </button>
        );
      })}
    </div>
  );
}