import { resolve } from "path";
import { defineConfig } from "vite";
import vitePluginPug from "./plugins/vite-plugin-pug";
import { viteStaticCopy } from "vite-plugin-static-copy";

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
  plugins: [
    vitePluginPug(),
    viteStaticCopy({
      targets: [
        {
          src: "./js/config.json",
          dest: ".",
        },
      ],
    }),
  ],
});
