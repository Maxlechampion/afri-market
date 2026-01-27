import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // ✅ Variables d'environnement avec le bon préfixe VITE_
  define: {
    'import.meta.env.VITE_API_KEY': JSON.stringify(process.env.VITE_API_KEY || ''),
    'import.meta.env.VITE_FEDAPAY_PUBLIC_KEY': JSON.stringify(process.env.VITE_FEDAPAY_PUBLIC_KEY || ''),
  },
  
  // Configuration de build optimisée pour Vercel
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: './index.html',
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
        }
      }
    }
  },
  
  // Optimisation du serveur de développement
  server: {
    port: 5173,
    strictPort: false,
    middlewareMode: false
  },
  
  // Support des variables d'environnement
  envPrefix: 'VITE_'
});