/**
 * src/services/notificationService.js
 * Serviço de notificações para Prana (push + local)
 * Usa Capacitor para iOS/Android
 * Fallback para Web Notifications API
 * 
 * Uso:
 *   await notificationService.initPushNotifications();
 *   await notificationService.sendPushNotification({
 *     title: "Tarefa",
 *     body: "Sua tarefa venceu",
 *     data: { taskId: "123" }
 *   });
 */

import { LocalNotifications } from '@capacitor/local-notifications';
import { App as CapacitorApp } from '@capacitor/app';

// Status do serviço
let isInitialized = false;
let permissionGranted = false;

/**
 * Inicializa notificações push
 */
export async function initPushNotifications() {
  try {
    // Solicitar permissões
    const perm = await LocalNotifications.requestPermissions();
    permissionGranted = perm.display === 'granted';
    
    if (!permissionGranted) {
      console.warn('[Notifications] Permissão de notificações negada');
      return false;
    }

    // Listener para notificações recebidas (app aberto)
    LocalNotifications.addListener('localNotificationActionPerformed', (event) => {
      handleNotificationTap(event.notification);
    });

    // Listener para notificações recebidas (app fechado)
    LocalNotifications.addListener('localNotificationReceived', (event) => {
      console.log('[Notifications] Notificação recebida:', event.notification);
    });

    isInitialized = true;
    console.log('[Notifications] ✅ Inicializado com sucesso');
    
    return true;
  } catch (error) {
    console.error('[Notifications] Erro na inicialização:', error);
    return false;
  }
}

/**
 * Solicita permissão para notificações
 */
export async function requestPermissions() {
  try {
    const perm = await LocalNotifications.requestPermissions();
    permissionGranted = perm.display === 'granted';
    return permissionGranted;
  } catch (error) {
    console.error('[Notifications] Erro ao solicitar permissões:', error);
    return false;
  }
}

/**
 * Envia notificação push
 */
export async function sendPushNotification({ 
  title = 'Prana', 
  body = '', 
  data = {},
  badge = 1,
  schedule = null 
} = {}) {
  try {
    if (!isInitialized) {
      console.warn('[Notifications] Serviço não inicializado');
      return false;
    }

    if (!permissionGranted) {
      console.warn('[Notifications] Permissão não concedida');
      return false;
    }

    const notification = {
      title,
      body,
      id: Math.floor(Math.random() * 1000000),
      badge,
      largeBody: body,
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#667eea',
      extra: data,
    };

    // Se tem schedule, programar notificação
    if (schedule) {
      notification.schedule = schedule;
      await LocalNotifications.schedule({ notifications: [notification] });
      console.log('[Notifications] 📅 Notificação agendada:', notification.id);
    } else {
      // Enviar imediatamente
      await LocalNotifications.schedule({ notifications: [notification] });
      console.log('[Notifications] 🔔 Notificação enviada:', notification.id);
    }

    return true;
  } catch (error) {
    console.error('[Notifications] Erro ao enviar notificação:', error);
    return false;
  }
}

/**
 * Agenda notificação para depois
 */
export async function scheduleNotification({ 
  title = 'Prana',
  body = '',
  data = {},
  in_minutes = 5 // Por padrão, 5 minutos
} = {}) {
  try {
    const at = new Date();
    at.setMinutes(at.getMinutes() + in_minutes);

    await sendPushNotification({
      title,
      body,
      data,
      schedule: {
        at: at,
        allowWhileIdle: true,
      },
    });

    return true;
  } catch (error) {
    console.error('[Notifications] Erro ao agendar:', error);
    return false;
  }
}

/**
 * Obtém token do dispositivo para push remoto (FCM/APNs)
 */
export async function getPushToken() {
  try {
    // Nota: Requere @capacitor/push-notifications instalado
    // E configuração de FCM/APNs
    console.log('[Notifications] Push tokens requerem setup de FCM/APNs');
    return null;
  } catch (error) {
    console.error('[Notifications] Erro ao obter token:', error);
    return null;
  }
}

/**
 * Trata clique em notificação
 */
function handleNotificationTap(notification) {
  console.log('[Notifications] Notificação clicada:', notification);

  // Extrair dados da notificação
  const data = notification.extra || {};
  
  // Se tem ação, executá-la
  if (data.action) {
    handleNotificationAction(data.action, data);
  }

  // Dispatch evento para app
  window.dispatchEvent(new CustomEvent('notificationTapped', { detail: notification }));
}

/**
 * Executa ação de notificação (navegação, etc)
 */
function handleNotificationAction(action, data) {
  console.log('[Notifications] Ação:', action, data);

  // Exemplo: navigate_to task/123
  // Seria tratado pela app usando o evento dispatchado
}

/**
 * Limpa todas as notificações
 */
export async function clearAll() {
  try {
    await LocalNotifications.removeAllDeliveredNotifications();
    console.log('[Notifications] ✅ Todas as notificações limpas');
    return true;
  } catch (error) {
    console.error('[Notifications] Erro ao limpar:', error);
    return false;
  }
}

/**
 * Cancela notificação específica
 */
export async function cancel(id) {
  try {
    await LocalNotifications.cancel({ notifications: [{ id }] });
    console.log('[Notifications] ✅ Notificação cancelada:', id);
    return true;
  } catch (error) {
    console.error('[Notifications] Erro ao cancelar:', error);
    return false;
  }
}

/**
 * Verifica status de permissões
 */
export function hasPermission() {
  return permissionGranted;
}

/**
 * Verifica se está inicializado
 */
export function isReady() {
  return isInitialized && permissionGranted;
}

export default {
  initPushNotifications,
  requestPermissions,
  sendPushNotification,
  scheduleNotification,
  getPushToken,
  clearAll,
  cancel,
  hasPermission,
  isReady,
};
