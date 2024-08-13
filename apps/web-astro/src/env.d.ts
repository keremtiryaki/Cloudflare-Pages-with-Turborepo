/// <reference types="astro/client" />
type Runtime = import("@astrojs/cloudflare").Runtime<import("lib/worker-configuration").CloudflareBindings>;

declare namespace App {
	interface Locals extends Runtime {
	}
}