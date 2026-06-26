import React from 'react';
import './LoadingOverlay.css';

export default function LoadingOverlay({ show = false, color = '#0d6efd', size = 60 }) {
  if (!show) return null;

  const spinnerStyle = {
    width: size,
    height: size,
    borderColor: `${color} transparent transparent transparent`,
  };

  return (
    <div className="hlp-loading-overlay">
      <div className="hlp-loading-inner">
        <div className="hlp-spinner" style={spinnerStyle} />
      </div>
    </div>
  );
}
