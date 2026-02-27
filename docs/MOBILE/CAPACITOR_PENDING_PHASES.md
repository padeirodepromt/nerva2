# 📋 PENDÊNCIAS - CAPACITOR PHASES 3 & 4

**Status:** 🟡 DOCUMENTADO - NÃO INICIADO  
**Prioridade:** APÓS completar Prana (i18n, integrações, diários, migrações)

---

## ⏳ Fases Pendentes

### **Phase 3: Advanced Plugins Integration** (3 dias)
**Status:** ❌ Não iniciado  
**Pré-requisito:** Prana deve estar 100% funcional

#### Tarefas:
- [ ] Integrar Camera em componentes reais (upload de fotos em projects/tasks)
- [ ] Implementar Geolocation tracking (localizar tasks/eventos)
- [ ] Setup Push Notifications (FCM para Android, APNs para iOS)
- [ ] File system access (exportar/importar dados)
- [ ] Haptic feedback (feedback tátil em mobile)
- [ ] Testar todos plugins em app real

#### Componentes a atualizar:
- ProjectHub.jsx - Upload de fotos
- TaskCard.jsx - Location tagging
- Chat.jsx - Foto attachment
- Settings.jsx - Notificações config
- Dashboard.jsx - Sync em background

---

### **Phase 4: Build & Deploy** (2 dias)
**Status:** ❌ Não iniciado  
**Pré-requisito:** Phase 3 completo + App funcionando 100%

#### iOS (TestFlight)
- [ ] Gerar signing certificates (Apple Developer)
- [ ] Criar provisioning profiles
- [ ] Build em Xcode: Product → Archive
- [ ] Upload para TestFlight
- [ ] Testes em device real
- [ ] App Store submission

#### Android (Google Play)
- [ ] Gerar release keystore
- [ ] Sign APK/AAB
- [ ] Upload para Google Play Console
- [ ] Internal testing
- [ ] Play Store submission

#### Both Platforms
- [ ] Privacy Policy
- [ ] Terms of Service
- [ ] App screenshots
- [ ] Description + metadata
- [ ] Rating category
- [ ] Content rating questionnaire

---

## 📊 Timeline Estimado

```
NOW (Dec 12-19):
├─ ✅ Capacitor Phases 1 & 2 (DONE)
└─ 🔄 Prana completion (i18n, integrações, diários, migrações)
   ├─ i18n: 18 horas
   ├─ Integrações: 40 horas
   ├─ Diários: 40 horas
   └─ Migrações: 30 horas
     Total: ~128 horas (~3-4 semanas)

WEEK 4-5 (Jan):
├─ Phase 3: Advanced plugins (3 dias)
└─ Phase 4: Build & Deploy (2 dias)
```

---

## 🎯 Prioridade: PRANA COMPLETO PRIMEIRO

### Tarefas Críticas (fazer antes de Capacitor Phase 3 & 4):

1. **i18n (PT + ES + EN)** ✅ Documentado
   - Traduzir LanguageProvider.jsx
   - Integrar em todas 16+ views
   - Traduzir prompts do Ash

2. **Integrações** ✅ Documentado
   - Google Calendar
   - GitHub Issues
   - Spotify (mood tracking)
   - Slack (reminders)

3. **Diários Holísticos** ✅ Documentado
   - DiaryEntryEditor.jsx (TipTap)
   - Pasta "diários" em ProjectHub
   - Ash insights (astrologia, energia, human design)

4. **Migrações** ✅ Documentado
   - Exportação completa (ZIP)
   - Importação de dados
   - Preservar hierarquia

5. **Views/Pages** ✅ Documentado
   - Conectar ProjectView ao layout
   - Remover páginas obsoletas
   - Testar todas 16 views

6. **Mobile Specifics**
   - Responsive layouts (todas views)
   - Touch gestures
   - Performance mobile

---

## 🔗 Documentação Referência

Quando chegar em Phase 3 & 4, usar:
- `NATIVE_APP_BRIEFING.md` - Estratégia completa
- `CAPACITOR_SETUP_COMPLETE.md` - Como foi setup
- `CAPACITOR_TESTING_GUIDE.md` - Como testar
- `CAPACITOR_PHASE2_COMPLETE.md` - Detalhes Phase 2

---

## ✅ Checklist Pré-Phase 3

Antes de iniciar Phase 3, garantir que:
- [ ] i18n 100% completo (PT, ES, EN)
- [ ] Todas integrações funcionando
- [ ] Diários implementados
- [ ] Todas 16 views testadas
- [ ] App está 100% funcional no web
- [ ] Responsive design completo
- [ ] Performance otimizada
- [ ] Build passando sem warnings
- [ ] Documentação atualizada

---

## 📝 Notas

- **Não remover** arquivos de setup Capacitor durante Prana completion
- **Manter sincronizado:** `npm run build && npx cap sync` após mudanças
- **Testar web primeiro:** Antes de testar em iOS/Android
- **Documentar mudanças:** Add/update CHANGELOG.md

---

## 🚀 Próxima Ação

Focar em completar Prana com:
1. i18n PT+ES+EN
2. Integrações Google/GitHub/Spotify
3. Diários holísticos
4. Migrações completas
5. Views conectadas e testadas

**Depois:** Phase 3 & 4 do Capacitor (app stores)

---

**Status Final:** 🟡 READY - Awaiting Prana completion

Proximos comandos:
```bash
# Continuar desenvolvimento normal
npm run dev

# Quando pronto para Phase 3:
npm run build && npx cap sync && npx cap open ios
```
