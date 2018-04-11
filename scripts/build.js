#!/usr/bin/env node

const colors = require('colors');
const exec = require('child_process').exec;
const pkg = require('../package.json');

const basename = 'routerrouter'
const packageName = 'RouterRouter';
const releaseYear = 2013;

const preamble = `/*!
 *  ${packageName} ${pkg.version}
 *
 *  ${pkg.description}
 *
 *  Source code available at: ${pkg.homepage}
 *
 *  Backbone is (c) 2011-2017 Jeremy Ashkenas, DocumentCloud
 *
 *  ${packageName} is (c) ${releaseYear}-present ${pkg.author.name} (${pkg.author.url})
 *
 *  ${packageName} may be freely distributed under the ${pkg.license} license.
 *
 *  For more about Backbone, visit: http://backbonejs.org
 */
`;

exec(`$(npm bin)/uglifyjs src/${basename}.js --beautify 'indent-level=2' --preamble '${preamble}' --output dist/${basename}.js`);
exec(`$(npm bin)/uglifyjs src/${basename}.js --compress --mangle --preamble '${preamble}' --output dist/${basename}.min.js`);

console.log(colors.green(`${packageName} ${pkg.version} built successfully!`));
