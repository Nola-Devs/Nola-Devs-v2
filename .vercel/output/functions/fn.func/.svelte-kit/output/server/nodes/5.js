

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/contact/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.cc6998c9.js","_app/immutable/chunks/scheduler.a6242329.js","_app/immutable/chunks/index.c8fa46e6.js"];
export const stylesheets = [];
export const fonts = [];
