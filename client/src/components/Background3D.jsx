import React from 'react';
import './Background2D.css';

export default function Background3D() {
  return (
    <div className="animated-bg-container">
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <div className="particles-layer"></div>
    </div>
  );
}
