#!/usr/bin/env node

let colors = require('colors');
let exec = require('child_process').exec;
let pkg = require('../package.json');
let year = new Date().getFullYear();

let preamble = `/*!
 *  RouterRouter ${pkg.version}
 *
 *  ${pkg.description}
 *
 *  Source code available at: ${pkg.homepage}
 *
 *  Backbone is
 *  (c) 2011-${year} Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 *
 *  RouterRouter is
 *  (c) 2013-${year} ${pkg.author.name} (${pkg.author.url})
 *
 *  Like Backbone, RouterRouter may be freely distributed under the ${pkg.license} license.
 *
 *  For more about Backbone, visit: http://backbonejs.org
 */
`;

exec(`$(npm bin)/uglifyjs src/routerrouter.js --beautify 'indent-level=2' --preamble '${preamble}' --output dist/routerrouter.js`);
exec(`$(npm bin)/uglifyjs src/routerrouter.js --compress --mangle --preamble '${preamble}' --output dist/routerrouter.min.js`);

console.log(colors.green(`RouterRouter ${pkg.version} built successfully!`));
