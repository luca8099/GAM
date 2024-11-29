import React from 'react';
import './LoadingPopup.css';

const LoadingPopup = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-popup">
        <div className="loader"></div>
        
      </div>
    </div>
  );
};
  
export default LoadingPopup;
