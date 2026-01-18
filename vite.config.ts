import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * RPR-KONTROL: Vite Harbor Config (v1.4.1)
 * Authority: JULES (The Orchestrator)
 * Phase 2 Implementation: Integrated Tailwind v4 engine.
 */

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const outputDir = env.BUILD_OUTPUT_DIR || 'dist';

  return {
    server: {
      port: 3000,
      host: '0.0.0.0'
    },
    plugins: [
      react(),
      tailwindcss() // Plan Phase 2: Add Tailwind v4 plugin
    ],
    build: {
      outDir: outputDir,
      emptyOutDir: true // Plan Phase 2: Ensure clean builds for kontrol target
    },
    // Removed define block: Using import.meta.env for better browser compatibility
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.')
      }
    }
  };
});
