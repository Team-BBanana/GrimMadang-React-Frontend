import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: '0.0.0.0', // 모든 네트워크 인터페이스에서 접근 가능
    port: 5173,      // 필요하면 포트 변경 가능
  },
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
    ],
  },
});
