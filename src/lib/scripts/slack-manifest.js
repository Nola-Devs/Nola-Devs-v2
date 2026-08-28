/**
 * Prints the eventbot app manifest with `${VARIABLES}` substituted from the
 * environment, so the tunnel URL never has to be committed to the repo.
 *
 * The Slack CLI reads this through the `get-manifest` hook in .slack/hooks.json,
 * so `slack install` and `slack manifest info` both pick up your current tunnel.
 */

import { existsSync, readFileSync } from 'node:fs';

const MANIFEST_PATH = 'slackbot-config.json';
const ENV_PATH = '.env.local';

/**
 * Minimal .env reader. The Slack CLI invokes this outside of Vite, so
 * SvelteKit's $env modules are not available here.
 *
 * @param {string} path
 * @returns {Record<string, string>}
 */
const readEnvFile = (path) => {
	if (!existsSync(path)) {
		return {};
	}

	return Object.fromEntries(
		readFileSync(path, 'utf8')
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line && !line.startsWith('#'))
			// flatMap rather than map + filter so a line without an `=` drops out
			// without leaving a null behind
			.flatMap((line) => {
				const separator = line.indexOf('=');

				if (separator === -1) {
					return [];
				}

				const key = line.slice(0, separator).trim();
				const value = line
					.slice(separator + 1)
					.trim()
					.replace(/^['"]|['"]$/g, '');

				return [[key, value]];
			})
	);
};

const env = { ...readEnvFile(ENV_PATH), ...process.env };
const manifest = readFileSync(MANIFEST_PATH, 'utf8');

const missing = new Set();

const resolved = manifest.replace(/\$\{(\w+)\}/g, (match, name) => {
	const value = env[name];

	if (!value) {
		missing.add(name);
		return match;
	}

	// trailing slashes would double up against the paths in the manifest
	return value.replace(/\/+$/, '');
});

if (missing.size) {
	console.error(
		`Missing environment variable(s) for ${MANIFEST_PATH}: ${[...missing].join(', ')}\n` +
			`Set them in ${ENV_PATH}. See EVENTBOT.md for how to get your tunnel URL.`
	);
	process.exit(1);
}

process.stdout.write(resolved);
