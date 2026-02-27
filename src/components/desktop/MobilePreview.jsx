import React from 'react';
import MobileWorkspaceLayout from '@/components/mobile/MobileWorkspaceLayout';

// Força o modo mobile para visualização desktop
function FakeMobileProvider({ children }) {
  React.useEffect(() => {
    // Força o data-useragent para mobile
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'iPhone',
      configurable: true,
    });
    document.documentElement.classList.add('mobile-preview');
    return () => {
      document.documentElement.classList.remove('mobile-preview');
    };
  }, []);
  return children;
}

export default function MobilePreview() {
  return (
    <div style={{
      width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222',
    }}>
      <div style={{
        width: 390, height: 800, border: '12px solid #222', borderRadius: 36, boxShadow: '0 8px 32px #0008', overflow: 'hidden', background: '#111', position: 'relative',
      }}>
        <FakeMobileProvider>
          <MobileWorkspaceLayout />
        </FakeMobileProvider>
        {/* Moldura do "celular" */}
        <div style={{position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 60, height: 6, background: '#333', borderRadius: 3, opacity: 0.5}} />
      </div>
    </div>
  );
}
