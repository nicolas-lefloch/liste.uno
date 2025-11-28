import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  build: {
    ssr: false
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), svgr({}), VitePWA({
    // cache all the imports
    workbox: {
      globPatterns: ["**/*"],
    },
    // cache all the
    // static assets in the public folder
    includeAssets: [
      "**/*",
    ],
    manifest: {
      "short_name": "Liste.Uno",
      "name": "Liste.Uno",
      "icons": [
        {
          "src": "transplogo144x144.png",
          "sizes": "144x144",
          "type": "image/png"
        },
        {
          "src": "transplogo144x144.png",
          "sizes": "144x144",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "transplogo512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
        }
      ],
      "start_url": ".",
      "display": "standalone",
      "theme_color": "#000000",
      "background_color": "#ffffff"
    }
  })],
});
