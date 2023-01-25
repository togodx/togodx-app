import { resolve } from "path";
import { defineConfig } from "vite";
import vitePluginPug from "./plugins/vite-plugin-pug";

export default defineConfig({
  root: "source",

  build: {
    outDir: resolve(__dirname, "build"),
    rollupOptions: {
      input: {
        main: resolve(__dirname, "source", "index.pug"),
      },
    },
  },
  plugins: [vitePluginPug()],
});
