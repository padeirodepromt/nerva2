# ✅ Capacitor Setup Completo para Prana

**Data:** December 12, 2025  
**Status:** 🟢 PHASE 1 COMPLETE  
**Time spent:** ~45 minutes

---

## 📋 O que foi feito

### ✅ 1. Instalação de Dependências
```bash
npm install @capacitor/core @capacitor/cli --save-dev
npm install @capacitor/ios @capacitor/android --save
npm install @capacitor/camera @capacitor/geolocation @capacitor/local-notifications @capacitor/device --save
```

### ✅ 2. Inicialização Capacitor
```bash
npx cap init "Prana" "com.prana.app" --web-dir=dist
```

### ✅ 3. Configuração Vite
- Alterado `vite.config.js`: `outDir: 'dist/client'` → `outDir: 'dist'`
- Razão: Capacitor espera `dist/` como raiz do web assets

### ✅ 4. Build e Sync
```bash
npm run build  # Cria dist/ com index.html
npx cap sync   # Sincroniza com iOS e Android
```

### ✅ 5. Adição de Plataformas
- iOS: ✅ Adicionado (requer macOS + Xcode)
- Android: ✅ Adicionado (requer Android Studio)

---

## 📁 Estrutura Criada

```
/workspaces/prana3.0/
├── capacitor.config.json           ← Config Capacitor
├── dist/                           ← Web assets (build output)
│   ├── index.html
│   ├── assets/
│   └── ...
├── ios/                            ← Projeto Xcode (macOS only)
│   ├── App/
│   ├── Pods/
│   └── ...
├── android/                        ← Projeto Android Studio
│   ├── app/
│   ├── build.gradle
│   └── ...
└── package.json                    ← Capacitor + plugins
```

---

## 🔧 Plugins Instalados

| Plugin | Propósito |
|--------|-----------|
| `@capacitor/camera` | Câmera + Galeria |
| `@capacitor/geolocation` | GPS + Location |
| `@capacitor/local-notifications` | Notificações locais |
| `@capacitor/device` | Info do device |

**Próximos plugins a considerar:**
- `@capacitor/app` (App lifecycle)
- `@capacitor/keyboard` (Mobile keyboard)
- `@capacitor/status-bar` (Status bar styling)
- `@capacitor/splash-screen` (Splash screen)
- `@capacitor/filesystem` (File I/O)

---

## 📝 Configuração Capacitor

```json
{
  "appId": "com.prana.app",
  "appName": "Prana",
  "webDir": "dist"
}
```

**Próximas config necessárias para production:**
```json
{
  "appId": "com.prana.app",
  "appName": "Prana",
  "webDir": "dist",
  
  "server": {
    "url": "https://prana.app",
    "cleartext": false
  },
  
  "ios": {
    "scheme": "App",
    "limitsNavigationsToAppBoundDomains": true,
    "preferredConfig": "Debug"
  },
  
  "android": {
    "allowMixedContent": true,
    "webContentsDebuggingEnabled": true
  },
  
  "plugins": {
    "Camera": {
      "permissions": ["photos", "camera"]
    },
    "Geolocation": {
      "permissions": ["location"]
    },
    "LocalNotifications": {
      "smallIcon": "ic_launcher",
      "iconColor": "#FF6B3B"
    }
  }
}
```

---

## 🚀 Próximas Etapas

### Phase 2: Mobile Optimizations (2 dias)
- [ ] Safe area handling (notch/home indicator)
- [ ] Status bar styling (dark/light mode)
- [ ] Keyboard handling
- [ ] Back button behavior (Android)
- [ ] Splash screen + Icons
- [ ] App configuration (app.json)

### Phase 3: Native Features (3 dias)
- [ ] Câmera integrada
- [ ] Geolocation tracking
- [ ] Local notifications
- [ ] Device info access

### Phase 4: Build & Deploy (2 dias)
- [ ] iOS build (Xcode) → TestFlight
- [ ] Android build (Android Studio) → Google Play
- [ ] Testing em device real
- [ ] Bug fixes

---

## 🛠️ Como Usar Agora

### Development (Web)
```bash
npm run dev
# Abre http://localhost:5173 com HMR
```

### Development (iOS)
```bash
# Pré-requisito: macOS + Xcode
npx cap open ios
# Abre em Xcode; pressione ▶ ou cmd+R para buildar
```

### Development (Android)
```bash
# Pré-requisito: Android Studio + SDK
npx cap open android
# Abre em Android Studio; clique em ▶ Play
```

### Sincronizar após mudanças
```bash
npm run build
npx cap sync  # Sincroniza web assets + plugins
```

---

## ⚠️ Limitações Atuais

1. **macOS Required para iOS**
   - Xcode só roda em macOS
   - Se estiver em Linux/Windows: skip iOS por agora

2. **Java/Android SDK Required para Android**
   - Android Studio é pesado (~5-10 GB)
   - Pode pular build por agora, testar em web

3. **WebView Limitations**
   - Capacitor usa WebView (Chrome no Android, Safari no iOS)
   - Performance ~95% nativa
   - Algumas APIs nativas podem ter latência

4. **CORS/Local API**
   - Capacitor local (file://) não funciona com fetch HTTP por padrão
   - Solução: usar `@capacitor-community/http` plugin ou HTTPS

---

## 📊 Verificação de Status

```bash
# Checar plataformas
npx cap doctor

# Resultado esperado:
# ✅ iOS: Installed
# ✅ Android: Installed
# ✅ Web: Ready
```

---

## 🎯 Arquitetura Atual

```
┌─────────────────────────────────┐
│   React/Vite/Tailwind (Web)    │
│   src/ → dist/                  │
└──────────────┬──────────────────┘
               │
               ↓ (npm run build)
        ┌──────────────┐
        │   dist/      │
        │ index.html   │
        └──────┬───────┘
               │
     ┌─────────┴──────────┐
     ↓                    ↓
  ┌─────┐          ┌────────────┐
  │ iOS │          │  Android   │
  │(Web-│          │  (Capacitor)
  │View)│          │             
  └─────┘          └────────────┘
```

---

## 📦 Checklist para Production

- [ ] Status bar styling (dark/light)
- [ ] Safe area insets
- [ ] Splash screen design
- [ ] App icons (1024x1024)
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Capacitor config production
- [ ] iOS signing certificates
- [ ] Android keystore
- [ ] Build & test em device real
- [ ] TestFlight submission
- [ ] Google Play submission

---

## 🔗 Recursos Úteis

- [Capacitor Docs](https://capacitorjs.com/docs/getting-started)
- [iOS Development](https://developer.apple.com/xcode/)
- [Android Development](https://developer.android.com/studio)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)

---

## 📝 Notas

- **Git:** Adicione `ios/` e `android/` ao `.gitignore` se não quer commitar
- **Deployment:** Web + App rodam mesmo código (reutilização 100%)
- **Updates:** Mudanças no web precisam `npm run build + npx cap sync`
- **Performance:** WebView é eficiente em 2025, ~95% de performance nativa

---

**Status:** ✅ PRONTO PARA PHASE 2

Próximo comando:
```bash
npx cap doctor
```
