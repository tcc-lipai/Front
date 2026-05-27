import React from 'react';
import { FEEDBACK_TYPES } from './types';
import './index.css'; 

const FeedbackCard = ({ isOpen, onClose, text, type = FEEDBACK_TYPES.DEFAULT, onNext }) => {
  
  const handleNextClick = () => {
    if (onNext) onNext(); 
    onClose();            
  };

  return (
    <div 
      className={`feedback-overlay ${isOpen ? 'active' : ''}`} 
      onClick={onClose}
    >
      <div 
        className={`feedback-container ${type}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="feedback-header">Feedback</h2>
        
        <p className="feedback-content">
          {text}
        </p>
        
        <div className="feedback-footer">
          <button className="feedback-button" onClick={handleNextClick}>
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;