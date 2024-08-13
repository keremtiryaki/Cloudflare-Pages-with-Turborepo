wrangler types --env-interface CloudflareBindings
sed -ie 's|interface CloudflareBindings|export interface CloudflareBindings|g' worker-configuration.d.ts
rm -rf worker-configuration.d.tse