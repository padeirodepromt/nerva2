import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  resolve: {
    alias: [
      { 
        find: '@', 
        replacement: path.resolve(__dirname, './src') 
      },
      
      // [FIX FINAL] Mapeamento EXATO arquivo-por-arquivo.
      // Removemos o mapeamento de diretório para evitar conflito.
      
      // 1. Para o React Flow / Zustand
      { 
        find: 'use-sync-external-store/shim/with-selector.js', 
        replacement: path.resolve(__dirname, 'node_modules/use-sync-external-store/shim/with-selector.js') 
      },

      // 2. Para o Tiptap (Versão explícita com extensão)
      { 
        find: 'use-sync-external-store/shim/index.js', 
        replacement: path.resolve(__dirname, 'node_modules/use-sync-external-store/shim/index.js') 
      },
       // 3. Para o Tiptap (Versão curta, apenas se necessário)
       { 
        find: 'use-sync-external-store/shim', 
        replacement: path.resolve(__dirname, 'node_modules/use-sync-external-store/shim/index.js') 
      },
    ],
  },

  optimizeDeps: {
    // Mantemos a exclusão para evitar que o Vite tente "adivinhar" os exports
    exclude: [
      '@tiptap/react',
      '@tiptap/starter-kit',
      '@tiptap/extension-bubble-menu',
      '@tiptap/extension-floating-menu'
    ],
  },

  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: ['postgres', 'pg', 'events'],
    },
  },
});