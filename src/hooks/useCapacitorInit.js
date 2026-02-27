/**
 * useCapacitorInit.js
 * Hook para inicializar e configurar Capacitor para mobile
 * 
 * Responsabilidades:
 * - Safe area handling (notch/home indicator)
 * - Status bar styling (dark/light mode)
 * - Keyboard management
 * - Back button behavior
 * - App lifecycle events
 */

import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { SplashScreen } from '@capacitor/splash-screen';

export const useCapacitorInit = () => {
  useEffect(() => {
    const initializeCapacitor = async () => {
      try {
        // 1. Hide splash screen after app loads
        await SplashScreen.hide();
        console.log('✅ Splash screen hidden');
      } catch (err) {
        console.warn('⚠️ Splash screen error:', err);
      }

      try {
        // 2. Configure status bar (dark text on light background)
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#ffffff' });
        console.log('✅ Status bar configured');
      } catch (err) {
        console.warn('⚠️ Status bar error:', err);
      }

      try {
        // 3. Configure keyboard (hide on scroll)
        await Keyboard.setAccessoryBarVisible({ isVisible: true });
        console.log('✅ Keyboard configured');
      } catch (err) {
        console.warn('⚠️ Keyboard error:', err);
      }

      try {
        // 4. Configure back button (Android)
        App.addListener('backButton', ({ canGoBack }) => {
          if (!canGoBack) {
            // Ask user to confirm before exiting
            if (window.confirm('Exit Prana?')) {
              App.exitApp();
            }
          } else {
            // Go back if we can
            window.history.back();
          }
        });
        console.log('✅ Back button handler registered');
      } catch (err) {
        console.warn('⚠️ Back button error:', err);
      }

      try {
        // 5. Handle app pause/resume
        App.addListener('appStateChange', ({ isActive }) => {
          if (isActive) {
            console.log('🟢 App resumed');
          } else {
            console.log('⏸️ App paused');
          }
        });
      } catch (err) {
        console.warn('⚠️ App state error:', err);
      }
    };

    initializeCapacitor();
  }, []);
};

/**
 * Funções utilitárias para usar em componentes
 */

// Mostrar/esconder status bar dinamicamente
export const setStatusBarStyle = async (isDark = true) => {
  try {
    const style = isDark ? Style.Dark : Style.Light;
    await StatusBar.setStyle({ style });
  } catch (err) {
    console.warn('Status bar style error:', err);
  }
};

// Mostrar/esconder keyboard
export const toggleKeyboard = async (show = true) => {
  try {
    if (show) {
      await Keyboard.show();
    } else {
      await Keyboard.hide();
    }
  } catch (err) {
    console.warn('Keyboard toggle error:', err);
  }
};

// Detectar se está em mobile (Capacitor)
export const isNativeApp = () => {
  return (
    typeof window !== 'undefined' &&
    (window.cordova !== undefined ||
      window.Capacitor !== undefined)
  );
};

// Detectar safe area (notch/home indicator)
export const getSafeAreaInsets = () => {
  const style = getComputedStyle(document.documentElement);
  return {
    top: parseInt(style.getPropertyValue('--safe-area-inset-top'), 10) || 0,
    right: parseInt(style.getPropertyValue('--safe-area-inset-right'), 10) || 0,
    bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom'), 10) || 0,
    left: parseInt(style.getPropertyValue('--safe-area-inset-left'), 10) || 0,
  };
};

export default useCapacitorInit;
