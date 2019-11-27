var path = require('path');
var pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(pathToPhaser, 'dist/phaser.js');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// If dev is true, it executes faster, if you want to run production, set it to false(it will take longer but be smaller)
const dev = false;

module.exports = {
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, '../dist/public'),
		filename: 'bundle.js',
	},
	mode: dev ? 'development' : 'production',
	module: {
		rules: [
			{ test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/' },
			{ test: /phaser\.js$/, loader: 'expose-loader?Phaser' },
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		alias: {
			phaser: phaser,
		},
	},
	externals: {
		// require("jquery") is external and available
		//  on the global var jQuery
		phaser: 'Phaser.min',
	},
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				uglifyOptions: {
					output: {
						comments: false,
					},
				},
			}),
		],
	},
};
