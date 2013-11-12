module.exports = {
	options: {
		pkg: require('../package.json'),
		banner:
			'/*!\n' +
			' *  <%= uglify.options.pkg.name %> <%= uglify.options.pkg.version %>\n' +
			' *\n' +
			' *  A very basic JavaScript routing library extracted from Backbone\'s Router.\n' +
			' *\n' +
			' *  Lovingly derived by <%= uglify.options.pkg.author %>.\n' +
			' *  Source code available at: <%= uglify.options.pkg.homepage %>\n' +
			' *\n' +
			' *  Backbone is\n' +
			' *  (c) 2011-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors\n' +
			' *\n' +
			' *  RouterRouter is\n' +
			' *  (c) 2013—present <%= uglify.options.pkg.author %>\n' +
			' *\n' +
			' *  Like Backbone, RouterRouter may be freely distributed under the MIT license.\n' +
			' *\n' +
			' *  For more about Backbone, visit: http://backbonejs.org\n' +
			' */\n\n'
	},
	main: {
		options: {
			beautify: {
				'beautify': true,
				'indent_level': 2
			},
			compress: false,
			mangle: false
		},
		files: {
			'dist/routerrouter.js': ['src/routerrouter.js']
		}
	},
	minified: {
		files: {
			'dist/routerrouter.min.js': ['src/routerrouter.js']
		}
	}
};