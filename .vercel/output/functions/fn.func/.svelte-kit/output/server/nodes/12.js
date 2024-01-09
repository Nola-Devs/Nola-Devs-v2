import * as server from '../entries/pages/admin/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.96446636.js","_app/immutable/chunks/scheduler.a6242329.js","_app/immutable/chunks/index.c8fa46e6.js","_app/immutable/chunks/singletons.faf27191.js","_app/immutable/chunks/index.857747a2.js","_app/immutable/chunks/stores.cb101d8f.js"];
export const stylesheets = ["_app/immutable/assets/12.1af8c6a9.css"];
export const fonts = [];
