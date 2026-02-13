import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      global: true,
      process: true,
      buffer: true,
    }),
  ],

  define: {
    global: "window",
  },

  server: {
    host: "0.0.0.0",   // 🔥 Allow mobile + external access
    port: 3001,

    cors: true,        // 🔥 Prevent CORS issues

    proxy: {
      "/api": {
        target: "http://localhost:4001",
        changeOrigin: true,
      },
      "/socket.io": {   // 🔥 If using socket.io in your chat app
        target: "http://localhost:4001",
        ws: true,
      },
    },
  },
});
