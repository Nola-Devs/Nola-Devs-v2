

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.eaf648e6.js","_app/immutable/chunks/scheduler.a6242329.js","_app/immutable/chunks/index.c8fa46e6.js","_app/immutable/chunks/stores.cb101d8f.js","_app/immutable/chunks/singletons.faf27191.js","_app/immutable/chunks/index.857747a2.js"];
export const stylesheets = [];
export const fonts = [];
