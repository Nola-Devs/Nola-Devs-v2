

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.c99ee89c.js","_app/immutable/chunks/scheduler.a6242329.js","_app/immutable/chunks/index.c8fa46e6.js","_app/immutable/chunks/singletons.528e32be.js","_app/immutable/chunks/index.857747a2.js"];
export const stylesheets = [];
export const fonts = [];
