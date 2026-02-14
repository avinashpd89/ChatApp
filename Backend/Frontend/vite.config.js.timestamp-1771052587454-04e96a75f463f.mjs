// vite.config.js
import { defineConfig } from "file:///C:/Users/avina/OneDrive/Documents/React/chatApp1/Backend/Frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/avina/OneDrive/Documents/React/chatApp1/Backend/Frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { nodePolyfills } from "file:///C:/Users/avina/OneDrive/Documents/React/chatApp1/Backend/Frontend/node_modules/vite-plugin-node-polyfills/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      global: true,
      process: true,
      buffer: true
    })
  ],
  define: {
    global: "window"
  },
  server: {
    host: "0.0.0.0",
    // 🔥 Allow mobile + external access
    port: 3001,
    cors: true,
    // 🔥 Prevent CORS issues
    proxy: {
      "/api": {
        target: "http://localhost:4001",
        changeOrigin: true
      },
      "/socket.io": {
        // 🔥 If using socket.io in your chat app
        target: "http://localhost:4001",
        ws: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhdmluYVxcXFxPbmVEcml2ZVxcXFxEb2N1bWVudHNcXFxcUmVhY3RcXFxcY2hhdEFwcDFcXFxcQmFja2VuZFxcXFxGcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYXZpbmFcXFxcT25lRHJpdmVcXFxcRG9jdW1lbnRzXFxcXFJlYWN0XFxcXGNoYXRBcHAxXFxcXEJhY2tlbmRcXFxcRnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2F2aW5hL09uZURyaXZlL0RvY3VtZW50cy9SZWFjdC9jaGF0QXBwMS9CYWNrZW5kL0Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCB7IG5vZGVQb2x5ZmlsbHMgfSBmcm9tIFwidml0ZS1wbHVnaW4tbm9kZS1wb2x5ZmlsbHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgbm9kZVBvbHlmaWxscyh7XG4gICAgICBnbG9iYWw6IHRydWUsXG4gICAgICBwcm9jZXNzOiB0cnVlLFxuICAgICAgYnVmZmVyOiB0cnVlLFxuICAgIH0pLFxuICBdLFxuXG4gIGRlZmluZToge1xuICAgIGdsb2JhbDogXCJ3aW5kb3dcIixcbiAgfSxcblxuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiBcIjAuMC4wLjBcIiwgICAvLyBcdUQ4M0RcdUREMjUgQWxsb3cgbW9iaWxlICsgZXh0ZXJuYWwgYWNjZXNzXG4gICAgcG9ydDogMzAwMSxcblxuICAgIGNvcnM6IHRydWUsICAgICAgICAvLyBcdUQ4M0RcdUREMjUgUHJldmVudCBDT1JTIGlzc3Vlc1xuXG4gICAgcHJveHk6IHtcbiAgICAgIFwiL2FwaVwiOiB7XG4gICAgICAgIHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjQwMDFcIixcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIFwiL3NvY2tldC5pb1wiOiB7ICAgLy8gXHVEODNEXHVERDI1IElmIHVzaW5nIHNvY2tldC5pbyBpbiB5b3VyIGNoYXQgYXBwXG4gICAgICAgIHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjQwMDFcIixcbiAgICAgICAgd3M6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVksU0FBUyxvQkFBb0I7QUFDcGEsT0FBTyxXQUFXO0FBQ2xCLFNBQVMscUJBQXFCO0FBRTlCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLGNBQWM7QUFBQSxNQUNaLFFBQVE7QUFBQSxNQUNSLFNBQVM7QUFBQSxNQUNULFFBQVE7QUFBQSxJQUNWLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFFQSxRQUFRO0FBQUEsSUFDTixRQUFRO0FBQUEsRUFDVjtBQUFBLEVBRUEsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFFTixNQUFNO0FBQUE7QUFBQSxJQUVOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxNQUNoQjtBQUFBLE1BQ0EsY0FBYztBQUFBO0FBQUEsUUFDWixRQUFRO0FBQUEsUUFDUixJQUFJO0FBQUEsTUFDTjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
