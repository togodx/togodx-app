/* eslint-disable import/no-unresolved */
import { resolve } from "path";
import { defineConfig } from "vite";
import vitePluginPug from "./plugins/vite-plugin-pug";
import { viteStaticCopy } from "vite-plugin-static-copy";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  root: "source",

  build: {
    // eslint-disable-next-line no-undef
    outDir: resolve(__dirname, "build"),
    rollupOptions: {
      input: {
        // eslint-disable-next-line no-undef
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
    eslint(),
  ],
});
