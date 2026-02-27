# 📱 APP NATIVO PRANA - BRIEFING TÉCNICO

## 1. OPÇÕES DE IMPLEMENTAÇÃO

### A. **REACT NATIVE** (Mobile-First)
**Pros:**
- ✅ Code-sharing entre iOS e Android (~70% compartilhado)
- ✅ Performance nativa
- ✅ Acesso a APIs nativas (câmera, GPS, notificações)
- ✅ App store distribution (Apple/Google)

**Cons:**
- ❌ Reescrever lógica específica (React Web vs React Native)
- ❌ Diferentes bibliotecas UI (React Native Paper, Expo)
- ❌ Curva de aprendizado para layout (Flexbox apenas)

**Ferramentas:**
- **Expo:** Mais rápido, managed service (recomendado para MVP)
- **React Native CLI:** Mais controle, compilação nativa

**Estimativa:** 2-4 semanas para MVP (auth + chat + tarefas)

---

### B. **CAPACITOR** ⭐ RECOMENDADO PARA PRANA
**Pros:**
- ✅ Usa código React/Web existente (reutiliza 90%+)
- ✅ PWA + Web + iOS + Android com mesma base
- ✅ Menor learning curve (é Web em container nativo)
- ✅ Rápido deploy: web + app juntos
- ✅ Acesso nativo via plugins (câmera, notificações, etc)
- ✅ Hot reload durante desenvolvimento

**Cons:**
- ⚠️ Webview tem overhead (mas imperceptível em 2025)
- ⚠️ Performance vs React Native nativo (~95% comparável)

**Stack:**
```
Prana Web (React/Vite/Tailwind)
         ↓
Capacitor (bridge)
         ↓
iOS (Swift) + Android (Java/Kotlin)
```

**Estimativa:** 1-2 semanas para MVP (reutiliza 90% do código)

---

### C. **FLUTTER** (Google Alternative)
**Pros:**
- ✅ Performance superior
- ✅ Belo UI por padrão
- ✅ Comunidade crescente

**Cons:**
- ❌ Reescrever tudo em Dart
- ❌ Zero reutilização de código React
- ❌ Overkill para MVP

**Estimativa:** 4-6 semanas (rewrite completo)

---

### D. **ELECTRON** (Desktop)
**Pros:**
- ✅ Reutiliza 99% do código React
- ✅ Windows + Mac + Linux

**Cons:**
- ❌ Não é mobile
- ❌ File size grande (~150-200 MB)

**Não recomendado** para foco mobile

---

## 2. ESTRATÉGIA RECOMENDADA: CAPACITOR

### Por que Capacitor?

```
┌─────────────────────────────────────┐
│   Código React/Web (Existente)      │
│  (Chat, Tasks, Calendar, Dashboard) │
└────────────────────────┬────────────┘
                         │ Sem mudanças
                         ↓
        ┌────────────────────────────┐
        │  Capacitor CLI             │
        │  (npx cap add ios/android) │
        └────────┬───────────┬───────┘
                 │           │
            iOS SDK     Android SDK
                 │           │
        ┌────────┴───────┬───┴──────┐
        ↓                ↓          ↓
    Xcode         Android Studio  VS Code
    (build)       (build)      (dev)
```

### Implementação Step-by-Step

**Fase 1: Preparação (1 dia)**
```bash
# Instalar Capacitor
npm install @capacitor/core @capacitor/cli

# Inicializar
npx cap init "Prana" "com.prana.app"

# Adicionar plataformas
npx cap add ios
npx cap add android
```

**Fase 2: Mobile Otimizations (2 dias)**
- ✅ Status bar dark/light mode
- ✅ Safe area (notch/home indicator)
- ✅ Keyboard handling
- ✅ Back button behavior
- ✅ Splash screen

**Fase 3: Native Plugins (3 dias)**
- 📸 Camera plugin
- 📍 Geolocation
- 🔔 Push notifications
- 📱 Device info
- ⚡ Battery status

**Fase 4: Build & Deploy (2 dias)**
- Build iOS (requires macOS + Xcode)
- Build Android (Android Studio)
- TestFlight / Google Play internal testing
- App Store / Play Store submission

---

## 3. ARQUITETURA CAPACITOR + PRANA

### Camadas:

```
┌──────────────────────────────────────────────────┐
│  Web UI (React/Vite/Tailwind) - Existente      │
│  + MobileWorkspaceLayout component              │
└──────────────────────────────────────────────────┘
                    ↓ (sem mudanças)
┌──────────────────────────────────────────────────┐
│  Capacitor Bridge                               │
│  - statusBar.show/hide()                        │
│  - device.getDeviceInfo()                       │
│  - camera.getPhoto()                            │
│  - geolocation.getCurrentPosition()             │
└──────────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────┐
│  Native Layer                                    │
│  iOS: Swift + UIKit                             │
│  Android: Kotlin + Jetpack Compose              │
└──────────────────────────────────────────────────┘
```

### Exemplo: Usar Câmera

```jsx
// React component (NO CHANGE needed!)
import { Camera, CameraResultType } from '@capacitor/camera';

export default function CameraButton() {
  const takePhoto = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    // Use image.webPath in <img src={} />
  };

  return <button onClick={takePhoto}>Tirar Foto</button>;
}
```

Browser: Usa HTML File Input  
App: Usa Camera nativa (iOS/Android)

---

## 4. PLANO DETALHADO: 3 SEMANAS PARA MVP NATIVO

### Semana 1: Setup + Mobile Optimization
**Dia 1: Setup Capacitor**
- [ ] `npm install @capacitor/*`
- [ ] `npx cap init`
- [ ] `npx cap add ios android`
- [ ] Sync: `npx cap sync`
- [ ] Test: `npm run dev` em browser + Xcode/Android Studio

**Dia 2: Mobile UI Polish**
- [ ] Safe area insets (notch handling)
- [ ] Status bar styling (dark/light)
- [ ] Keyboard handling (iOS/Android)
- [ ] Bottom nav spacing (respeit Home Indicator)

**Dia 3: Navigation & Back Button**
- [ ] Override back button (Android)
- [ ] Swipe back gesture (iOS)
- [ ] Navigation stack awareness

**Dia 4: Testing & Debugging**
- [ ] DevTools in browser
- [ ] Debug in Xcode (via USB)
- [ ] Debug in Android Studio
- [ ] Console logs visible

**Dia 5: Splashscreen & Icons**
- [ ] App icons (1024x1024)
- [ ] Splash screen
- [ ] Launch screens

### Semana 2: Native Integrations
**Dia 6-8: Camera + Files**
- [ ] Photo library integration
- [ ] File upload
- [ ] Document picker

**Dia 9: Geolocation**
- [ ] GPS access
- [ ] Background location (if needed)

**Dia 10: Push Notifications**
- [ ] FCM setup (Android)
- [ ] APNs setup (iOS)
- [ ] Toast notifications

### Semana 3: Build & Deploy
**Dia 11-12: iOS Build**
- [ ] Generate signing certificates (Apple Developer)
- [ ] Create provisioning profiles
- [ ] Build in Xcode: `Product → Archive`
- [ ] Upload to TestFlight

**Dia 13-14: Android Build**
- [ ] Generate release key
- [ ] Sign APK/AAB
- [ ] Upload to Google Play Console (internal testing)

**Dia 15: Testing & Polish**
- [ ] UAT on real devices
- [ ] Bug fixes
- [ ] Performance tuning

---

## 5. CUSTOS & REQUISITOS

### Hardware Necessário
- **iOS Development:**
  - macOS (Monterey+)
  - Xcode (100 GB)
  - Apple Developer account ($99/ano)
  - iPhone para testes (opcional, simulator ok)

- **Android Development:**
  - Windows/Mac/Linux ok
  - Android Studio (8 GB)
  - Google Play Developer account ($25 one-time)
  - Android device para testes (opcional, emulator ok)

### Custos Aproximados
| Item | Custo | Frequência |
|------|-------|-----------|
| Apple Developer | $99 | anual |
| Google Play Developer | $25 | one-time |
| Capacitor Pro (opcional) | $15-99/mês | - |
| **Total** | **$150-250/ano** | - |

---

## 6. CAPACITOR vs REACT NATIVE: COMPARAÇÃO

| Aspecto | Capacitor | React Native |
|--------|-----------|--------------|
| Code Reuse | 90%+ | 30-40% |
| Web + Mobile | Sim (mesmo código) | Não (separado) |
| Learning Curve | Baixa (já conhece React) | Alta (novo framework) |
| Performance | 95% nativa | 99% nativa |
| Time to MVP | 1-2 semanas | 2-4 semanas |
| Manutenção | Simples | Complexa (2 bases) |
| **Recomendado** | ✅ **SIM** | ❌ Não para MVP |

---

## 7. PRÓXIMOS PASSOS PARA PRANA

### Phase 1: Capacitor Setup (This Week)
```bash
# 1. Install
npm install @capacitor/core @capacitor/cli --save-dev

# 2. Init (responde interativo)
npx cap init

# 3. Build web first
npm run build

# 4. Add platforms
npx cap add ios
npx cap add android

# 5. Open in IDEs
npx cap open ios   # Xcode
npx cap open android  # Android Studio
```

### Phase 2: Mobile Plugins (Next Week)
- Camera
- Geolocation
- Notifications
- Device Info

### Phase 3: Build & Test (Week 3)
- TestFlight (iOS)
- Google Play Internal Testing (Android)

### Phase 4: App Store Submission (Week 4)
- Review & approval (1-3 days iOS, instant Android)
- Live on stores

---

## 8. ROADMAP COMPLETO

```
NOW (Semana 1):
├─ ✅ Message Bubbles Integration (Web)
├─ ✅ Tool Calls + Ash commands (Web)
└─ 🚀 Capacitor Setup + First Build

WEEK 2:
├─ Native Plugins (Camera, Location, Notifications)
├─ Safe area + Status bar polish
└─ iOS build + TestFlight

WEEK 3:
├─ Android build + Play Store
├─ Cross-platform testing
└─ Bug fixes

WEEK 4+:
├─ App Store submission
├─ Play Store submission
├─ User feedback loop
└─ Post-launch iterations
```

---

## 9. RECOMENDAÇÃO FINAL

### Para Prana: **USE CAPACITOR**

**Razões:**
1. ✅ Reutiliza 90%+ do código React existente
2. ✅ 1-2 semanas para MVP vs 2-4 com React Native
3. ✅ PWA funcional + App nativo com mesma base
4. ✅ Menor complexidade técnica
5. ✅ Mais fácil manutenção (uma base de código)
6. ✅ Escalável: começa simples, evolui com plugins

### Sequência Recomendada:
1. **Agora:** Terminar Message Bubbles + Tool Calls (Web)
2. **Próxima semana:** Capacitor setup + First build
3. **Semana 2:** Plugins + Polish
4. **Semana 3:** iOS build + TestFlight
5. **Semana 4:** Android build + Play Store

---

## 10. RECURSOS

### Documentação
- [Capacitor Docs](https://capacitorjs.com)
- [iOS Development](https://developer.apple.com)
- [Android Development](https://developer.android.com)

### Community
- [Capacitor Discord](https://discord.gg/capacitor)
- [React Native Community](https://github.com/react-native-community)

### Tools
- [Capacitor CLI](https://capacitorjs.com/docs/cli)
- [App Center (CI/CD)](https://appcenter.ms)
- [EAS (Expo CI/CD)](https://eas.expo.dev)

---

**DECISÃO: Proceder com Capacitor após Message Bubbles?** ✅ YES
