#!/usr/bin/env node

let cliTable = require('cli-table');
let commaNumber = require('comma-number');
let fs = require('fs');
let gzipSize = require('gzip-size');

let table = new cliTable({
	style: {
		head: ['cyan']
	}
});

table.push(
	{ 'Uncompressed': `${commaNumber(fs.statSync('./dist/routerrouter.js').size)} bytes` },
	{ 'Minified': `${commaNumber(fs.statSync('./dist/routerrouter.min.js').size)} bytes` },
	{ 'Minified + gzipped': `${commaNumber(gzipSize.sync(fs.readFileSync('./dist/routerrouter.min.js')))} bytes` }
);

console.log(table.toString());
