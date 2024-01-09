export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["data/events.json","data/groups.json","favicon.png","fonts/Panton.otf","fonts/Poppins.ttf","fonts/adam.otf","fonts/fonts.css","fonts/supercomputer.ttf","fonts/watchword.otf","googlef1f8e7be04d289ab.html","images/logo.webp","images/organizers/aaron_lee.webp","images/organizers/benjamin_eckel.webp","images/organizers/brook_davis.webp","images/organizers/calder_tillet.webp","images/organizers/chris_morrison.webp","images/organizers/colin_williams.webp","images/organizers/curtis_cummings.webp","images/organizers/david_whelen.webp","images/organizers/dustin_gaspard.webp","images/organizers/evie_poitevent_sanders.webp","images/organizers/garett_majoue.webp","images/organizers/jorge_carvajal.webp","images/organizers/lucia_berliner.webp","images/organizers/thomas_leblanc.webp","style-reset.css"]),
	mimeTypes: {".json":"application/json",".png":"image/png",".otf":"font/otf",".ttf":"font/ttf",".css":"text/css",".html":"text/html",".webp":"image/webp"},
	_: {
		client: {"start":"_app/immutable/entry/start.7e1498a2.js","app":"_app/immutable/entry/app.dce1643a.js","imports":["_app/immutable/entry/start.7e1498a2.js","_app/immutable/chunks/scheduler.a6242329.js","_app/immutable/chunks/singletons.faf27191.js","_app/immutable/chunks/index.857747a2.js","_app/immutable/entry/app.dce1643a.js","_app/immutable/chunks/scheduler.a6242329.js","_app/immutable/chunks/index.c8fa46e6.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js')),
			__memo(() => import('../output/server/nodes/3.js')),
			__memo(() => import('../output/server/nodes/4.js')),
			__memo(() => import('../output/server/nodes/5.js')),
			__memo(() => import('../output/server/nodes/6.js')),
			__memo(() => import('../output/server/nodes/7.js')),
			__memo(() => import('../output/server/nodes/8.js')),
			__memo(() => import('../output/server/nodes/9.js')),
			__memo(() => import('../output/server/nodes/10.js')),
			__memo(() => import('../output/server/nodes/11.js')),
			__memo(() => import('../output/server/nodes/12.js')),
			__memo(() => import('../output/server/nodes/13.js'))
		],
		routes: [
			{
				id: "/(app)",
				pattern: /^\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/admin/admin",
				pattern: /^\/admin\/admin\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/(app)/api/cron",
				pattern: /^\/api\/cron\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/(app)/api/cron/_server.ts.js'))
			},
			{
				id: "/(app)/contact",
				pattern: /^\/contact\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/(app)/events/[event]",
				pattern: /^\/events\/([^/]+?)\/?$/,
				params: [{"name":"event","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/(app)/group/[group]",
				pattern: /^\/group\/([^/]+?)\/?$/,
				params: [{"name":"group","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/(app)/mission-statement",
				pattern: /^\/mission-statement\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/(app)/sitemap.xml",
				pattern: /^\/sitemap\.xml\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/(app)/sitemap.xml/_server.ts.js'))
			},
			{
				id: "/(app)/sponsors",
				pattern: /^\/sponsors\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/(app)/submit-event",
				pattern: /^\/submit-event\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/(app)/team",
				pattern: /^\/team\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 11 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
