
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // On définit uniquement les clés nécessaires en les transformant en chaînes de caractères
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env.FEDAPAY_PUBLIC_KEY': JSON.stringify(process.env.FEDAPAY_PUBLIC_KEY),
  }
});
