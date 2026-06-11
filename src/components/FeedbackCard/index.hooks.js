import { useState } from 'react';
import { FEEDBACK_TYPES } from './types';

export const useFeedback = () => {
  const [feedbackState, setFeedbackState] = useState({
    isOpen: false,
    text: '',
    type: FEEDBACK_TYPES.DEFAULT
  });

  const openFeedback = (text, type = FEEDBACK_TYPES.DEFAULT) => {
    setFeedbackState({ isOpen: true, text, type });
  };

  const closeFeedback = () => {
    setFeedbackState(prevState => ({ ...prevState, isOpen: false }));
  };

  return {
    isOpen: feedbackState.isOpen,
    feedbackText: feedbackState.text,
    feedbackType: feedbackState.type,
    openFeedback,
    closeFeedback
  };
};