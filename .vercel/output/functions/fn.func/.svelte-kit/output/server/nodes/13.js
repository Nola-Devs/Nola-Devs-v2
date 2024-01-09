import * as server from '../entries/pages/admin/admin/_page.server.ts.js';

export const index = 13;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/admin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/admin/+page.server.ts";
export const imports = ["_app/immutable/nodes/13.c5de392c.js","_app/immutable/chunks/scheduler.a6242329.js","_app/immutable/chunks/index.c8fa46e6.js"];
export const stylesheets = [];
export const fonts = [];
