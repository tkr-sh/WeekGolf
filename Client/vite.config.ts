import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
// import sassPlugin from 'vite-plugin-sass';

export default defineConfig({
  // plugins: [solidPlugin(), sassPlugin()],
  plugins: [solidPlugin({
    ssr: true // enable server-side rendering
  })],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
