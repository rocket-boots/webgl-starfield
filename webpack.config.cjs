const path = require('path');
const package = require('./package.json');
const dirPath = path.resolve(__dirname);
const filename = `dist/stars-window.js`;

console.log(`---- Building ${package.name} into ${dirPath}/${filename} ----`);

const ex = {
	mode: 'production',
	target: 'web', // 'node' vs. 'web'
	entry: package.exports.import,
	output: {
		filename,
		path: dirPath,
		library: 'stars',
		libraryExport: 'default',
		libraryTarget: 'window'
	},
	devtool: 'inline-source-map',
	optimization: { minimize: true }, // TODO: remove when not testing
	// externals: [nodeExternals()], // for node
};
module.exports = ex;
