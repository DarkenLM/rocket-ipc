/**
 * Build Script Configuration File
 * 
 * This file controls scripts to run after the compilation of the src folder
 */

/**
 * Asset file builder
 * 
 * Copies non-source files (files not included in 'ignoreExts') to their respective folders on the build
 */

function assetBuilder() {
	const distPath = 'dist'
	const srcPath = 'src'
	const ignoreExts = [".ts", ".js", ".mjs"]
	const { resolve, join, sep, dirname, extname } = require('path');
	const { readdir, mkdir, copyFile } = require('fs').promises;
	const { existsSync } = require('fs');

	async function getFiles(dir) {
		const dirents = await readdir(dir, { withFileTypes: true });
		const files = await Promise.all(dirents.map((dirent) => {
			const res = resolve(dir, dirent.name);
			return dirent.isDirectory() ? getFiles(res) : res;
		}));
		return Array.prototype.concat(...files);
	}

	(async () => {
		let root = __dirname || process.cwd()
		let basePath = resolve(join(root, srcPath))
		let originals = await getFiles(basePath)

		originals.forEach(async orig => {
			let _srcFile = orig.replace(basePath, '')
			let srcFile = _srcFile.startsWith(sep) ? _srcFile.replace(sep, '') : _srcFile
			let reflectedFile = resolve(join(root, distPath, srcFile))
			let reflectedDirName = dirname(reflectedFile)

			if (ignoreExts.includes(extname(reflectedFile))) return;
			if (!existsSync(reflectedDirName)) await mkdir(reflectedDirName, {
				recursive: true
			})
			await copyFile(orig, reflectedFile)
		})
	})()
}

function init() {
	assetBuilder()
}

init()