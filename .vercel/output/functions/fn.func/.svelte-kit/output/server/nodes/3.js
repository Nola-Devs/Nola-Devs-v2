import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/3.efe5fec1.js","_app/immutable/chunks/scheduler.a6242329.js","_app/immutable/chunks/index.c8fa46e6.js","_app/immutable/chunks/each.1ef27b1c.js"];
export const stylesheets = [];
export const fonts = [];
