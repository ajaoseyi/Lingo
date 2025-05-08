import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import {viteSingleFile} from 'vite-plugin-singlefile'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    viteSingleFile(),
    {
      name: "fix-css-import",
      transform(code, id: any) {
        if (id.includes("@create-figma-plugin/ui")) {
          return code.replace(/!\.\.\/css\/base\.css/g, "../css/base.css");
        }
      },
    },
    tailwindcss(),
  ],
});
