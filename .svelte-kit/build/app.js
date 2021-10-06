import { respond } from '@sveltejs/kit/ssr';
import root from './generated/root.svelte';
import { set_paths, assets } from './runtime/paths.js';
import { set_prerendering } from './runtime/env.js';
import * as user_hooks from "./hooks.js";

const template = ({ head, body }) => "<!DOCTYPE html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<link rel=\"icon\" href=\"/favicon.png\" />\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n\t\t" + head + "\n\t</head>\n\t<body>\n\t\t<div id=\"svelte\">" + body + "</div>\n\t</body>\n</html>\n";

let options = null;

const default_settings = { paths: {"base":"","assets":""} };

// allow paths to be overridden in svelte-kit preview
// and in prerendering
export function init(settings = default_settings) {
	set_paths(settings.paths);
	set_prerendering(settings.prerendering || false);

	const hooks = get_hooks(user_hooks);

	options = {
		amp: false,
		dev: false,
		entry: {
			file: assets + "/_app/start-0ea462ea.js",
			css: [assets + "/_app/assets/start-61d1577b.css",assets + "/_app/assets/vendor-30b899a4.css"],
			js: [assets + "/_app/start-0ea462ea.js",assets + "/_app/chunks/vendor-d9f04eca.js"]
		},
		fetched: undefined,
		floc: false,
		get_component_path: id => assets + "/_app/" + entry_lookup[id],
		get_stack: error => String(error), // for security
		handle_error: (error, request) => {
			hooks.handleError({ error, request });
			error.stack = options.get_stack(error);
		},
		hooks,
		hydrate: true,
		initiator: undefined,
		load_component,
		manifest,
		paths: settings.paths,
		prerender: true,
		read: settings.read,
		root,
		service_worker: null,
		router: true,
		ssr: true,
		target: "#svelte",
		template,
		trailing_slash: "never"
	};
}

// input has already been decoded by decodeURI
// now handle the rest that decodeURIComponent would do
const d = s => s
	.replace(/%23/g, '#')
	.replace(/%3[Bb]/g, ';')
	.replace(/%2[Cc]/g, ',')
	.replace(/%2[Ff]/g, '/')
	.replace(/%3[Ff]/g, '?')
	.replace(/%3[Aa]/g, ':')
	.replace(/%40/g, '@')
	.replace(/%26/g, '&')
	.replace(/%3[Dd]/g, '=')
	.replace(/%2[Bb]/g, '+')
	.replace(/%24/g, '$');

const empty = () => ({});

const manifest = {
	assets: [{"file":"app.scss","size":3343,"type":"text/x-scss"},{"file":"assets/images/relax/barrel.jpg","size":101865,"type":"image/jpeg"},{"file":"assets/images/relax/how_1.jpg","size":92547,"type":"image/jpeg"},{"file":"assets/images/relax/how_2.png","size":230157,"type":"image/png"},{"file":"assets/images/relax/how_3.jpg","size":55993,"type":"image/jpeg"},{"file":"assets/images/relax/sauna.jpg","size":424357,"type":"image/jpeg"},{"file":"assets/images/relax/smoke.jpg","size":66341,"type":"image/jpeg"},{"file":"assets/images/relax/stone.png","size":16616,"type":"image/png"},{"file":"assets/images/relax/whatissauna.jpg","size":527739,"type":"image/jpeg"},{"file":"favicon.png","size":1571,"type":"image/png"}],
	layout: ".svelte-kit/build/components/layout.svelte",
	error: ".svelte-kit/build/components/error.svelte",
	routes: [
		{
						type: 'page',
						pattern: /^\/$/,
						params: empty,
						a: [".svelte-kit/build/components/layout.svelte", "src/routes/index.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/attr\/?$/,
						params: empty,
						a: [".svelte-kit/build/components/layout.svelte", "src/routes/attr.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					}
	]
};

// this looks redundant, but the indirection allows us to access
// named imports without triggering Rollup's missing import detection
const get_hooks = hooks => ({
	getSession: hooks.getSession || (() => ({})),
	handle: hooks.handle || (({ request, resolve }) => resolve(request)),
	handleError: hooks.handleError || (({ error }) => console.error(error.stack)),
	externalFetch: hooks.externalFetch || fetch
});

const module_lookup = {
	".svelte-kit/build/components/layout.svelte": () => import("./components\\layout.svelte"),".svelte-kit/build/components/error.svelte": () => import("./components\\error.svelte"),"src/routes/index.svelte": () => import("..\\..\\src\\routes\\index.svelte"),"src/routes/attr.svelte": () => import("..\\..\\src\\routes\\attr.svelte")
};

const metadata_lookup = {".svelte-kit/build/components/layout.svelte":{"entry":"layout.svelte-40f12716.js","css":["assets/vendor-30b899a4.css"],"js":["layout.svelte-40f12716.js","chunks/vendor-d9f04eca.js"],"styles":[]},".svelte-kit/build/components/error.svelte":{"entry":"error.svelte-eff55757.js","css":["assets/vendor-30b899a4.css"],"js":["error.svelte-eff55757.js","chunks/vendor-d9f04eca.js"],"styles":[]},"src/routes/index.svelte":{"entry":"pages/index.svelte-a3e6bbdb.js","css":["assets/pages/index.svelte-614b827b.css","assets/vendor-30b899a4.css"],"js":["pages/index.svelte-a3e6bbdb.js","chunks/vendor-d9f04eca.js","pages/attr.svelte-c026d3a8.js"],"styles":[]},"src/routes/attr.svelte":{"entry":"pages/attr.svelte-c026d3a8.js","css":["assets/vendor-30b899a4.css"],"js":["pages/attr.svelte-c026d3a8.js","chunks/vendor-d9f04eca.js"],"styles":[]}};

async function load_component(file) {
	const { entry, css, js, styles } = metadata_lookup[file];
	return {
		module: await module_lookup[file](),
		entry: assets + "/_app/" + entry,
		css: css.map(dep => assets + "/_app/" + dep),
		js: js.map(dep => assets + "/_app/" + dep),
		styles
	};
}

export function render(request, {
	prerender
} = {}) {
	const host = request.headers["host"];
	return respond({ ...request, host }, options, { prerender });
}