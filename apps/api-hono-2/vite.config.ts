import pages from '@hono/vite-cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    ClosePlugin(),
    pages({
      entry: 'src/index.ts'
    }),
    devServer({
      adapter: adapter({
        proxy: {
          configPath: "../../packages/lib/wrangler.toml",
          persist: {
            path: "../../packages/lib/.wrangler/state/v3",
          },
        }
      }),
      entry: 'src/index.ts'
    })
  ]
})


function ClosePlugin() {
  return {
      name: 'ClosePlugin', // required, will show up in warnings and errors

      // use this to catch errors when building
      buildEnd(error: any) {
          if(error) {
              console.error('Error bundling')
              console.error(error)
              process.exit(1)
          } else {
              console.log('Build ended')
          }
      },

      // use this to catch the end of a build without errors
      closeBundle(id?: any) {
          console.log('Bundle closed')
          process.exit(0)
      },
  }
}