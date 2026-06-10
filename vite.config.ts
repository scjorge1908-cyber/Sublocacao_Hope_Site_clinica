import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/Sublocacao_Hope_Site_clinica/',
  plugins: [react(), tailwindcss()],
})
