import * as server from '../entries/pages/(app)/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.94c257e2.js","_app/immutable/chunks/scheduler.a6242329.js","_app/immutable/chunks/index.c8fa46e6.js","_app/immutable/chunks/each.1ef27b1c.js","_app/immutable/chunks/Toaster.df570f23.js","_app/immutable/chunks/index.857747a2.js"];
export const stylesheets = ["_app/immutable/assets/4.f16d8cba.css","_app/immutable/assets/Toaster.cbe0dfb9.css"];
export const fonts = [];
