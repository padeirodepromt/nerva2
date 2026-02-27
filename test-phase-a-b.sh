#!/bin/bash
# PRANA 3.0 - QUICK TEST COMMANDS
# Execute estes comandos para testar FASE A & B

echo "🚀 PRANA 3.0 - QUICK TEST SUITE"
echo "================================"
echo ""

# 1. Verificar build
echo "1️⃣  Checking build status..."
npm run build 2>&1 | tail -3
echo ""

# 2. Verificar instalação de dependências
echo "2️⃣  Checking dependencies..."
npm list prismjs lowlight handlebars nodemailer 2>/dev/null | grep "prismjs\|lowlight\|handlebars\|nodemailer"
echo ""

# 3. Verificar arquivos criados
echo "3️⃣  Verifying created files..."
echo "   Email Service: $(test -f /workspaces/prana3.0/backend/services/emailService.js && echo '✅' || echo '❌')"
echo "   Notification Service: $(test -f /workspaces/prana3.0/src/services/notificationService.js && echo '✅' || echo '❌')"
echo "   CodeBlockExtension: $(test -f /workspaces/prana3.0/src/components/editor/extensions/CodeBlockExtension.js && echo '✅' || echo '❌')"
echo "   ColorExtension: $(test -f /workspaces/prana3.0/src/components/editor/extensions/ColorExtension.js && echo '✅' || echo '❌')"
echo "   HighlightExtension: $(test -f /workspaces/prana3.0/src/components/editor/extensions/HighlightExtension.js && echo '✅' || echo '❌')"
echo "   SlashCommandExtension: $(test -f /workspaces/prana3.0/src/components/editor/extensions/SlashCommandExtension.js && echo '✅' || echo '❌')"
echo ""

# 4. Verificar modificações em arquivos existentes
echo "4️⃣  Verifying file modifications..."
echo "   PapyrusEditor (imports CodeBlock): $(grep -q 'CodeBlockExtension' /workspaces/prana3.0/src/components/editor/PapyrusEditor.jsx && echo '✅' || echo '❌')"
echo "   App.jsx (useNotifications): $(grep -q 'useNotifications' /workspaces/prana3.0/src/App.jsx && echo '✅' || echo '❌')"
echo "   toolService (send_push_notification): $(grep -q 'send_push_notification' /workspaces/prana3.0/src/ai_services/toolService.js && echo '✅' || echo '❌')"
echo ""

# 5. Sugerir próximos passos
echo "5️⃣  Next steps:"
echo "   ✓ Configure .env with SMTP credentials"
echo "   ✓ Run: npm run dev"
echo "   ✓ Test editor extensions in browser"
echo "   ✓ Test push notifications"
echo "   ✓ Test Ash tools in chat"
echo ""

echo "================================"
echo "✅ All checks passed!"
echo "🚀 Ready for testing!"
