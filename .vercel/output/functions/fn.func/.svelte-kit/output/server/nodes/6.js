

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/events/_event_/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.627bb1d9.js","_app/immutable/chunks/scheduler.a6242329.js","_app/immutable/chunks/index.c8fa46e6.js"];
export const stylesheets = [];
export const fonts = [];
