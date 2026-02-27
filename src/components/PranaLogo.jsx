import React from 'react';

const PranaLogo = ({ className = "w-10 h-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={`logo-mark ${className}`}>
    <path d="M 20 45 Q 10 40, 15 30 C 20 10, 80 10, 85 30 Q 90 40, 80 45 C 70 55, 30 55, 20 45 Z" className="fill-[var(--accent)]" />
    <path d="M 20 55 Q 10 60, 15 70 C 20 90, 80 90, 85 70 Q 90 60, 80 55 C 70 45, 30 45, 20 55 Z" className="fill-[var(--accent)]" />
  </svg>
);

export default PranaLogo;
