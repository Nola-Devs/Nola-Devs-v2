import * as server from '../entries/pages/(app)/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.15fe21fc.js","_app/immutable/chunks/scheduler.a6242329.js","_app/immutable/chunks/index.c8fa46e6.js","_app/immutable/chunks/each.1ef27b1c.js"];
export const stylesheets = ["_app/immutable/assets/2.f5335b36.css"];
export const fonts = [];
