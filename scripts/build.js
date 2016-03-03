#!/usr/bin/env node

var colors = require('colors'),
	exec = require('child_process').exec,
	pkg = require('../package.json'),
	year = new Date().getFullYear(),
	preamble = '/*!\n' +
		' *  RouterRouter ' + pkg.version + '\n' +
		' *\n' +
		' *  ' + pkg.description + '\n' +
		' *\n' +
		' *  Lovingly derived by ' + pkg.author.name + ' (' + pkg.author.url + ')\n' +
		' *  Source code available at: ' + pkg.homepage + '\n' +
		' *\n' +
		' *  Backbone is\n' +
		' *  (c) 2011-' + year + ' Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors\n' +
		' *\n' +
		' *  RouterRouter is\n' +
		' *  (c) 2013-' + year + ' ' + pkg.author.name + '\n' +
		' *\n' +
		' *  Like Backbone, RouterRouter may be freely distributed under the MIT license.\n' +
		' *\n' +
		' *  For more about Backbone, visit: http://backbonejs.org\n' +
		' */\n';

exec('$(npm bin)/uglifyjs src/routerrouter.js --beautify "indent-level=2" --preamble "' + preamble + '" --output dist/routerrouter.js');
exec('$(npm bin)/uglifyjs src/routerrouter.js --compress --mangle --preamble "' + preamble + '" --output dist/routerrouter.min.js');

console.log(colors.green('RouterRouter %s built successfully!'), pkg.version);