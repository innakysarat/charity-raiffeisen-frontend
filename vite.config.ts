import { defineConfig, splitVendorChunkPlugin } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import {join, resolve} from "path";
import {globSync} from "glob";

// https://vitejs.dev/config/
export default defineConfig({
  root: join(__dirname, "src"),
  plugins: [svelte({configFile: "../svelte.config.js"}), splitVendorChunkPlugin()],
  publicDir: "../public",
  build: {
    outDir: join(__dirname, "dist"),
    rollupOptions: {
      input: globSync(resolve(__dirname, "src", "*.html")),
      output: {
        manualChunks: {

        }
      }
    }
  }
})
