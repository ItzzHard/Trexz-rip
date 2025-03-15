import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  envDir: "../",
  server: {
    proxy: {
      "/api": {
        target: "https://trexz-b.onrender.com",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
    hmr: {
      clientPort: 443,
    },
    allowedHosts: ["trexzf.vercel.app"], // Add this line
  },
});
