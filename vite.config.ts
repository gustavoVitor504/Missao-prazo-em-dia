import { defineConfig } from "vite";

// base relativa: funciona na raiz (Vercel, Netlify) e em subpasta (GitHub Pages)
export default defineConfig({
  base: "./",
});
