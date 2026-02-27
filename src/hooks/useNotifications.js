/*
  useNotifications.js
  
  Hook para inicializar e gerenciar notificações push no App
  Integra com Capacitor LocalNotifications API
*/

import { useEffect, useRef } from 'react';
import notificationService from '@/services/notificationService';

export function useNotifications() {
  const initializedRef = useRef(false);

  useEffect(() => {
    // Evitar dupla inicialização em desenvolvimento
    if (initializedRef.current) return;
    initializedRef.current = true;

    async function initNotifications() {
      try {
        // 1. Inicializar serviço de notificações
        await notificationService.initPushNotifications();
        console.log('✅ Notification service initialized');

        // 2. Pedir permissões ao usuário
        const hasPermission = await notificationService.hasPermission();
        if (!hasPermission) {
          await notificationService.requestPermissions();
          console.log('✅ Notification permissions granted');
        }

        // 3. Get device token (para push remoto)
        const token = await notificationService.getPushToken();
        if (token) {
          console.log('✅ Device token:', token);
          // Enviar token para backend para salvar no perfil do usuário
          try {
            await fetch('/api/users/device-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ token })
            });
            console.log('✅ Device token salvo no backend');
          } catch (error) {
            console.error('❌ Erro ao salvar device token:', error);
          }
        }

      } catch (error) {
        console.error('❌ Error initializing notifications:', error);
      }
    }

    initNotifications();
  }, []);

  return {
    sendNotification: notificationService.sendPushNotification,
    scheduleNotification: notificationService.scheduleNotification,
    cancelNotification: notificationService.cancel,
    clearAll: notificationService.clearAll,
  };
}
