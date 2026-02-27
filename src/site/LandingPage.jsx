import React, { useState } from 'react';
import LandingPageHolistic from './personas/LandingPageHolistic';
import LandingPageDeveloper from './personas/LandingPageDeveloper';

export default function LandingPage() {
  const [persona, setPersona] = useState('holistic');

  const togglePersona = () => {
    setPersona(prev => prev === 'holistic' ? 'developer' : 'holistic');
  };

  return (
    <>
      {persona === 'holistic' ? (
        <LandingPageHolistic onTogglePersona={togglePersona} />
      ) : (
        <LandingPageDeveloper onTogglePersona={togglePersona} />
      )}
    </>
  );
}
