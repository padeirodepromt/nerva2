# 📱 Testando Prana com Capacitor

## Quick Start

### 1. **Browser (Desktop)**
```bash
npm run dev
# Abre http://localhost:5173
# Funciona 100%, mas plugins nativos não funcionam
```

### 2. **iOS (macOS only)**
```bash
npm run build       # Cria dist/
npx cap sync        # Sincroniza com Xcode
npx cap open ios    # Abre em Xcode
```

**Em Xcode:**
- Selecione simulator ou device real
- Pressione ▶ (Play) ou cmd+R
- App abre em WebView

### 3. **Android**
```bash
npm run build       # Cria dist/
npx cap sync        # Sincroniza com Android Studio
npx cap open android # Abre em Android Studio
```

**Em Android Studio:**
- Selecione emulator ou device real
- Pressione ▶ (Play) ou shift+F10
- App abre em WebView

---

## 🧪 Testar Features Nativas

### Opção 1: Usar Componente de Teste
```jsx
import CapacitorTestPanel from '@/components/mobile/CapacitorTestPanel';

export default function SettingsView() {
  return (
    <div>
      <h1>Settings</h1>
      <CapacitorTestPanel />  {/* Adicionar aqui */}
    </div>
  );
}
```

### Opção 2: Usar no Console
```javascript
// No browser console (F12)
import { Camera } from '@capacitor/camera';
const photo = await Camera.getPhoto();
console.log(photo);
```

### Opção 3: Usar em Componentes

```jsx
import { Camera, CameraResultType } from '@capacitor/camera';

function MyComponent() {
  const handlePhoto = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });
    console.log(image.webPath);
  };

  return <button onClick={handlePhoto}>Tirar Foto</button>;
}
```

---

## 📚 Plugins Disponíveis

| Plugin | Uso | Status |
|--------|-----|--------|
| `Camera` | Foto + Galeria | ✅ Pronto |
| `Geolocation` | GPS + Location | ✅ Pronto |
| `LocalNotifications` | Notificações | ✅ Pronto |
| `Device` | Info do device | ✅ Pronto |
| `App` | Lifecycle | ✅ Pronto |
| `StatusBar` | Status bar styling | ✅ Pronto |
| `Keyboard` | Keyboard mgmt | ✅ Pronto |
| `SplashScreen` | Splash screen | ✅ Pronto |

---

## 🔧 Workflow de Desenvolvimento

### Ciclo: Editar → Build → Sync → Test

```bash
# 1. Editar código (src/)
echo "// novo código" >> src/components/MyComponent.jsx

# 2. Build
npm run build

# 3. Sync com iOS/Android
npx cap sync

# 4. Testar em Xcode/Android Studio
npx cap open ios
# ou
npx cap open android
```

### HMR em Desenvolvimento

```bash
# Terminal 1: Dev server (HMR ativo)
npm run dev

# Terminal 2: Abrir em Xcode/Android Studio
npx cap open ios
```

**Mudanças em `src/` atualizam automaticamente no browser!**

Mas para ver mudanças no app nativo:
```bash
npm run build && npx cap sync
```

---

## 🐛 Debugging

### iOS (Xcode)
1. Abrir Xcode: `npx cap open ios`
2. Pressionar ▶ para rodar
3. Ver logs em Xcode console
4. Usar Safari DevTools (remoto)

### Android (Android Studio)
1. Abrir Android Studio: `npx cap open android`
2. Pressionar ▶ para rodar
3. Ver logs em Android Studio Logcat
4. Usar Chrome DevTools (remoto)

### Browser DevTools
```bash
npm run dev
# Abrir DevTools (F12)
# Console, Network, Storage, etc funciona normalmente
```

---

## ⚠️ Troubleshooting

### "Build failed in Xcode"
```bash
# Limpar caches
rm -rf ios/Pods
npx cap sync
npx cap open ios
```

### "Android emulator não funciona"
```bash
# Verificar emulator rodando
adb devices

# Se não listar, abrir em Android Studio:
# Tools > Device Manager > Create/Start emulator
```

### "Plugin não funciona"
1. Checar permissões em `capacitor.config.json`
2. Checar se está em device nativo (não browser)
3. Ver logs do console

### "WebView branco"
```bash
# Reconstruir
npm run build
npx cap sync
npx cap open ios  # ou android
```

---

## 📦 Estrutura Capacitor

```
/workspaces/prana3.0/
├── dist/                    ← Web assets (build output)
├── ios/                     ← Xcode project
│   ├── App/
│   │   ├── App.xcodeproj
│   │   └── Pods/           ← Native dependencies
├── android/                 ← Android Studio project
│   ├── app/
│   ├── build.gradle        ← Gradle config
│   └── settings.gradle
└── capacitor.config.json    ← Capacitor config
```

---

## 🚀 Production Build

### iOS (TestFlight)
```bash
# 1. Build web
npm run build

# 2. Abrir em Xcode
npx cap open ios

# 3. Em Xcode:
# - Product → Scheme → Release
# - Product → Archive
# - Distribute App → TestFlight
```

### Android (Google Play)
```bash
# 1. Build web
npm run build

# 2. Abrir em Android Studio
npx cap open android

# 3. Em Android Studio:
# - Build → Generate Signed Bundle / APK
# - Selecionar keystore
# - Upload para Google Play Console
```

---

## 📝 Documentação Oficial

- [Capacitor Docs](https://capacitorjs.com/docs)
- [iOS Development](https://developer.apple.com/ios/)
- [Android Development](https://developer.android.com)

---

## ✅ Checklist antes de Production

- [ ] Status bar styling (dark/light mode)
- [ ] Safe area insets (notch handling)
- [ ] Back button behavior (Android)
- [ ] Keyboard management
- [ ] Splash screen design
- [ ] App icons (1024x1024)
- [ ] Testar todas features nativas
- [ ] Testar em device real iOS
- [ ] Testar em device real Android
- [ ] Performance (FPS, battery, memory)

---

**Status:** ✅ Ready to test!

Próximo comando:
```bash
npm run dev
# ou
npx cap open ios
```
