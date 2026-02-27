import React from 'react';

const AtmosphereLayer = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.04] mix-blend-overlay">
      {/* SVG Noise Filter - Leve e performático */}
      <svg className="h-full w-full">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.6" 
            stitchTiles="stitch" 
            numOctaves="3" 
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
};

export default AtmosphereLayer;