/**
 * CapacitorTestPanel.jsx
 * Painel de testes para validar features do Capacitor em mobile
 * 
 * Uso: Importar em uma view de debug ou settings
 */

import React, { useState } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Device } from '@capacitor/device';
import { LocalNotifications } from '@capacitor/local-notifications';
import { App } from '@capacitor/app';

export default function CapacitorTestPanel() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(null);

  const log = (test, result, error = null) => {
    setResults((prev) => ({
      ...prev,
      [test]: { result, error, timestamp: new Date().toLocaleTimeString() },
    }));
  };

  // Teste 1: Câmera
  const testCamera = async () => {
    setLoading('camera');
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
      });
      log('camera', `✅ Photo taken: ${image.webPath}`, null);
    } catch (err) {
      log('camera', null, err.message);
    }
    setLoading(null);
  };

  // Teste 2: Geolocation
  const testGeolocation = async () => {
    setLoading('geolocation');
    try {
      const coords = await Geolocation.getCurrentPosition();
      log(
        'geolocation',
        `📍 Lat: ${coords.coords.latitude}, Lng: ${coords.coords.longitude}`,
        null
      );
    } catch (err) {
      log('geolocation', null, err.message);
    }
    setLoading(null);
  };

  // Teste 3: Device Info
  const testDeviceInfo = async () => {
    setLoading('device');
    try {
      const info = await Device.getInfo();
      log(
        'device',
        `📱 ${info.platform} ${info.osVersion} - ${info.model}`,
        null
      );
    } catch (err) {
      log('device', null, err.message);
    }
    setLoading(null);
  };

  // Teste 4: Local Notifications
  const testNotification = async () => {
    setLoading('notification');
    try {
      // Requisitar permissão
      const perm = await LocalNotifications.requestPermissions();
      if (perm.display === 'granted') {
        // Enviar notificação
        await LocalNotifications.schedule({
          notifications: [
            {
              title: 'Prana Test',
              body: 'Notificação de teste do Capacitor',
              id: 1,
              schedule: { at: new Date(Date.now() + 1000) },
            },
          ],
        });
        log('notification', '✅ Notificação enviada', null);
      } else {
        log('notification', null, 'Permissão negada');
      }
    } catch (err) {
      log('notification', null, err.message);
    }
    setLoading(null);
  };

  // Teste 5: App Lifecycle
  const testAppInfo = async () => {
    setLoading('app');
    try {
      const info = await App.getInfo();
      log('app', `🔔 Prana v${info.version} (Build: ${info.build})`, null);
    } catch (err) {
      log('app', null, err.message);
    }
    setLoading(null);
  };

  const TestButton = ({ name, onClick, loading: isLoading }) => (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`w-full px-4 py-2 rounded-lg font-medium transition ${
        isLoading
          ? 'bg-gray-400 cursor-not-allowed text-gray-700'
          : 'bg-orange-500 hover:bg-orange-600 text-white'
      }`}
    >
      {isLoading ? '⏳ Testando...' : `🧪 Test ${name}`}
    </button>
  );

  const ResultBox = ({ test }) => {
    const data = results[test];
    if (!data) return null;

    return (
      <div className={`p-3 rounded-lg ${data.error ? 'bg-red-100' : 'bg-green-100'}`}>
        <div className="text-sm font-mono">
          {data.error ? (
            <>
              <div className="text-red-800">❌ Error</div>
              <div className="text-red-700">{data.error}</div>
            </>
          ) : (
            <>
              <div className="text-green-800">✅ Success</div>
              <div className="text-green-700">{data.result}</div>
            </>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1">{data.timestamp}</div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-gray-800">🧪 Capacitor Tests</h2>

      <div className="space-y-3">
        <TestButton name="Camera" onClick={testCamera} loading={loading === 'camera'} />
        <ResultBox test="camera" />

        <TestButton
          name="Geolocation"
          onClick={testGeolocation}
          loading={loading === 'geolocation'}
        />
        <ResultBox test="geolocation" />

        <TestButton name="Device" onClick={testDeviceInfo} loading={loading === 'device'} />
        <ResultBox test="device" />

        <TestButton
          name="Notification"
          onClick={testNotification}
          loading={loading === 'notification'}
        />
        <ResultBox test="notification" />

        <TestButton name="App Info" onClick={testAppInfo} loading={loading === 'app'} />
        <ResultBox test="app" />
      </div>

      <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded">
        <p>💡 Dica: Este painel funciona apenas em:</p>
        <ul className="list-disc list-inside">
          <li>iOS (via Xcode ou device real)</li>
          <li>Android (via Android Studio ou device real)</li>
        </ul>
        <p className="mt-2">Em browser, algumas features podem não funcionar.</p>
      </div>
    </div>
  );
}
