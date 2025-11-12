/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// For GitHub Pages deployment under repository subpath, set base to repo name.
// If your repository name differs from project name adjust below.
export default defineConfig({
  base: '/jumpstarter-cooking/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
