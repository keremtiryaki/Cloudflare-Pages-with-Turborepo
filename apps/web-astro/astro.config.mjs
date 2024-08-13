import { defineConfig } from 'astro/config';

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
      configPath: "../../packages/lib/wrangler.toml",
      persist: {
        path: "../../packages/lib/.wrangler/state/v3",
      }
    }
  })
});