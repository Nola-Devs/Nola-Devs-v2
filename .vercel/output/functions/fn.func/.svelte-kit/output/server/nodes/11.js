

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/team/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/11.16fc58f3.js","_app/immutable/chunks/scheduler.a6242329.js","_app/immutable/chunks/index.c8fa46e6.js"];
export const stylesheets = [];
export const fonts = [];
