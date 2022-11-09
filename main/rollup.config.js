/* eslint-disable no-undef */
// script definitions see package.json
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import livereload from 'rollup-plugin-livereload';
// https://www.npmjs.com/package/rollup-plugin-copy-watch
import copy from 'rollup-plugin-copy-watch';
// import copy from 'rollup-plugin-copy';
import {
	terser
} from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import { version } from './package.json';

const production = process.env.PRODUCTION === "true";
console.log('process.env.npm_package_version ');
console.log(process.env.npm_package_version);
console.log("PRODUCTION", production, "(env: " + process.env.PRODUCTION + ")");

const serveWanted = process.env.SERVE === "true";

function resolveAfter4Seconds(x) {
	return new Promise(resolve => {
		setTimeout(() => {
			// var ver = process.env.npm_package_version;
			resolve(x);
		}, 4000);
	});
}

async function myTest() {
	console.log('before await');
	// eslint-disable-next-line no-unused-vars
	var y = await resolveAfter4Seconds('dummy argument');
	// console.log(y);
	console.log('version =', version);
}

myTest();
console.log('after start of myTest');

export default [{
	input: 'src/main.js',
	output: {
		sourcemap: !production,
		format: 'iife',
		name: 'bridge',
		file: 'public/build/keybased-tree-bundle.js'
	},
	plugins: [
		replace({
			'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
			preventAssignment: true
		}),
		json(),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/'),
			mainFields: ['main', 'module']
		}),
		builtins(),
		commonjs({
			preferBuiltins: false
		}),
		production && babel({
			babelHelpers: 'bundled'
		}),

		serveWanted && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when serving

		// enable/disable livereload here AND AT IMPORTS by uncommenting/commenting
		!production && livereload("public", {
			port: 5001
		}),

		// If we're building for production, minify
		production && terser(),

		copy({
			// see rollup-plugin-copy-watch
			watch: 'public/css',
			// targets: getCopyTargets("build/keybased-tree-bundle.js"),
			targets: [{ src: `./src/js/createDemoTree.js`, dest: `./public` }],
			hook: "writeBundle"
		})
	]
}];

function serve() {
	console.log("(run serve) -> serving...");
	let started = false;

	return {
		//writeBundle calls script 'npm run serve', see package.json
		writeBundle() {
			console.log('writeBundle');
			if (!started) {
				started = true;
				require('child_process').spawn('npm', ['run', 'serve', '--', '--dev'], {
					env: process.env,
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}