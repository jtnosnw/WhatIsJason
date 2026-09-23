import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages project site. The router basename must match.
  base: '/WhatIsJason/',
  plugins: [react()],
})
