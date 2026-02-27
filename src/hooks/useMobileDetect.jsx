import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1024;

/**
 * Hook para detectar tamanho de tela
 * Retorna: { isMobile, isTablet, isDesktop, screenSize }
 */
export function useMobileDetect() {
  const [deviceType, setDeviceType] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenSize: 'desktop',
    width: 0,
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      
      const isMobile = width < MOBILE_BREAKPOINT;
      const isTablet = width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT;
      const isDesktop = width >= TABLET_BREAKPOINT;
      
      let screenSize = 'desktop';
      if (isMobile) screenSize = 'mobile';
      else if (isTablet) screenSize = 'tablet';

      setDeviceType({
        isMobile,
        isTablet,
        isDesktop,
        screenSize,
        width,
      });
    };

    // Check on mount
    checkDevice();

    // Listen for resize
    window.addEventListener('resize', checkDevice);
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const checkListener = () => checkDevice();
    mediaQuery.addEventListener('change', checkListener);

    return () => {
      window.removeEventListener('resize', checkDevice);
      mediaQuery.removeEventListener('change', checkListener);
    };
  }, []);

  return deviceType;
}
