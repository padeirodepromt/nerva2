/* canvas: src/components/ui/PranaLogo.jsx
   desc: Logo Prana Corrigido. Usa classe 'logo-fill' para garantir preenchimento sólido sem bordas.
*/
import React from 'react';

export const PranaLogo = ({ className = "", ativo = false }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      // ADICIONADO: 'logo-fill' protege contra o reset global de SVG
      className={`transition-all duration-500 logo-fill ${className || "w-20 h-20"}`} 
      style={{ 
        color: ativo ? "#D97706" : "currentColor", 
        filter: ativo ? "drop-shadow(0 0 8px rgba(217, 119, 6, 0.5))" : "none"
      }}
    >
      <path d="M 20 45 Q 10 40, 15 30 C 20 10, 80 10, 85 30 Q 90 40, 80 45 C 70 55, 30 55, 20 45 Z" />
      <path d="M 20 55 Q 10 60, 15 70 C 20 90, 80 90, 85 70 Q 90 60, 80 55 C 70 45, 30 45, 20 55 Z" />
    </svg>
  );
};

export default PranaLogo;