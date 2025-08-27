/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,         // describe, test, expect をグローバルで使える
    setupFiles: './src/tests/setupTests.js', // 必要に応じて
  },
});
