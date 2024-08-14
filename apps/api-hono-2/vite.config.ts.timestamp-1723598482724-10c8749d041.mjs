// vite.config.ts
import pages from "file:///Users/k/Desktop/Projects/orderdev-com/turborepo-cf/node_modules/.pnpm/@hono+vite-cloudflare-pages@0.4.2_hono@4.5.5/node_modules/@hono/vite-cloudflare-pages/dist/index.js";
import devServer from "file:///Users/k/Desktop/Projects/orderdev-com/turborepo-cf/node_modules/.pnpm/@hono+vite-dev-server@0.14.0_hono@4.5.5/node_modules/@hono/vite-dev-server/dist/index.js";
import adapter from "file:///Users/k/Desktop/Projects/orderdev-com/turborepo-cf/node_modules/.pnpm/@hono+vite-dev-server@0.14.0_hono@4.5.5/node_modules/@hono/vite-dev-server/dist/adapter/cloudflare.js";
import { defineConfig } from "file:///Users/k/Desktop/Projects/orderdev-com/turborepo-cf/node_modules/.pnpm/vite@5.4.0/node_modules/vite/dist/node/index.js";
var vite_config_default = defineConfig({
  plugins: [
    ClosePlugin(),
    pages({
      entry: "src/index.ts",
      minify: true
    }),
    devServer({
      adapter: adapter({
        proxy: {
          configPath: "../../packages/lib/wrangler.toml",
          persist: {
            path: "../../packages/lib/.wrangler/state/v3"
          }
        }
      }),
      entry: "src/index.ts"
    })
  ]
});
function ClosePlugin() {
  return {
    name: "ClosePlugin",
    // required, will show up in warnings and errors
    // use this to catch errors when building
    buildEnd(error) {
      if (error) {
        console.error("Error bundling");
        console.error(error);
        process.exit(1);
      } else {
        console.log("Build ended");
      }
    },
    // use this to catch the end of a build without errors
    closeBundle(id) {
      console.log("Bundle closed");
      process.exit(0);
    }
  };
}
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvay9EZXNrdG9wL1Byb2plY3RzL29yZGVyZGV2LWNvbS90dXJib3JlcG8tY2YvYXBwcy9hcGktaG9uby0yXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvay9EZXNrdG9wL1Byb2plY3RzL29yZGVyZGV2LWNvbS90dXJib3JlcG8tY2YvYXBwcy9hcGktaG9uby0yL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9rL0Rlc2t0b3AvUHJvamVjdHMvb3JkZXJkZXYtY29tL3R1cmJvcmVwby1jZi9hcHBzL2FwaS1ob25vLTIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGFnZXMgZnJvbSAnQGhvbm8vdml0ZS1jbG91ZGZsYXJlLXBhZ2VzJ1xuaW1wb3J0IGRldlNlcnZlciBmcm9tICdAaG9uby92aXRlLWRldi1zZXJ2ZXInXG5pbXBvcnQgYWRhcHRlciBmcm9tICdAaG9uby92aXRlLWRldi1zZXJ2ZXIvY2xvdWRmbGFyZSdcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBDbG9zZVBsdWdpbigpLFxuICAgIHBhZ2VzKHtcbiAgICAgIGVudHJ5OiAnc3JjL2luZGV4LnRzJyxcbiAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICB9KSxcbiAgICBkZXZTZXJ2ZXIoe1xuICAgICAgYWRhcHRlcjogYWRhcHRlcih7XG4gICAgICAgIHByb3h5OiB7XG4gICAgICAgICAgY29uZmlnUGF0aDogXCIuLi8uLi9wYWNrYWdlcy9saWIvd3JhbmdsZXIudG9tbFwiLFxuICAgICAgICAgIHBlcnNpc3Q6IHtcbiAgICAgICAgICAgIHBhdGg6IFwiLi4vLi4vcGFja2FnZXMvbGliLy53cmFuZ2xlci9zdGF0ZS92M1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgZW50cnk6ICdzcmMvaW5kZXgudHMnXG4gICAgfSlcbiAgXVxufSlcblxuLy8gaXQgZG9lcyBub3Qgc3RvcCBhZnRlciB0aGUgYnVpbGQsIHNvIHRoaXMgcGx1Z2luIGhlbHBzIHRvIHN0b3AgdGhlIHByb2Nlc3NcbmZ1bmN0aW9uIENsb3NlUGx1Z2luKCkge1xuICByZXR1cm4ge1xuICAgICAgbmFtZTogJ0Nsb3NlUGx1Z2luJywgLy8gcmVxdWlyZWQsIHdpbGwgc2hvdyB1cCBpbiB3YXJuaW5ncyBhbmQgZXJyb3JzXG5cbiAgICAgIC8vIHVzZSB0aGlzIHRvIGNhdGNoIGVycm9ycyB3aGVuIGJ1aWxkaW5nXG4gICAgICBidWlsZEVuZChlcnJvcjogYW55KSB7XG4gICAgICAgICAgaWYoZXJyb3IpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgYnVuZGxpbmcnKVxuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQnVpbGQgZW5kZWQnKVxuICAgICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8vIHVzZSB0aGlzIHRvIGNhdGNoIHRoZSBlbmQgb2YgYSBidWlsZCB3aXRob3V0IGVycm9yc1xuICAgICAgY2xvc2VCdW5kbGUoaWQ/OiBhbnkpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnQnVuZGxlIGNsb3NlZCcpXG4gICAgICAgICAgcHJvY2Vzcy5leGl0KDApXG4gICAgICB9LFxuICB9XG59Il0sCiAgIm1hcHBpbmdzIjogIjtBQUEyWCxPQUFPLFdBQVc7QUFDN1ksT0FBTyxlQUFlO0FBQ3RCLE9BQU8sYUFBYTtBQUNwQixTQUFTLG9CQUFvQjtBQUU3QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxZQUFZO0FBQUEsSUFDWixNQUFNO0FBQUEsTUFDSixPQUFPO0FBQUEsTUFDUCxRQUFRO0FBQUEsSUFDVixDQUFDO0FBQUEsSUFDRCxVQUFVO0FBQUEsTUFDUixTQUFTLFFBQVE7QUFBQSxRQUNmLE9BQU87QUFBQSxVQUNMLFlBQVk7QUFBQSxVQUNaLFNBQVM7QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsUUFDRjtBQUFBLE1BQ0YsQ0FBQztBQUFBLE1BQ0QsT0FBTztBQUFBLElBQ1QsQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDO0FBR0QsU0FBUyxjQUFjO0FBQ3JCLFNBQU87QUFBQSxJQUNILE1BQU07QUFBQTtBQUFBO0FBQUEsSUFHTixTQUFTLE9BQVk7QUFDakIsVUFBRyxPQUFPO0FBQ04sZ0JBQVEsTUFBTSxnQkFBZ0I7QUFDOUIsZ0JBQVEsTUFBTSxLQUFLO0FBQ25CLGdCQUFRLEtBQUssQ0FBQztBQUFBLE1BQ2xCLE9BQU87QUFDSCxnQkFBUSxJQUFJLGFBQWE7QUFBQSxNQUM3QjtBQUFBLElBQ0o7QUFBQTtBQUFBLElBR0EsWUFBWSxJQUFVO0FBQ2xCLGNBQVEsSUFBSSxlQUFlO0FBQzNCLGNBQVEsS0FBSyxDQUFDO0FBQUEsSUFDbEI7QUFBQSxFQUNKO0FBQ0Y7IiwKICAibmFtZXMiOiBbXQp9Cg==
