import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub project Pages serves this repository under /cookbook_EM_11/.
export default defineConfig({
  base: '/cookbook_EM_11/',
  plugins: [react()],
})
