#!/usr/bin/env node

let exec = require('child_process').exec;

exec(`$(npm bin)/phantomjs ./node_modules/mocha-phantomjs-core/mocha-phantomjs-core.js ./spec/runner.html spec '{"useColors":true}'`, (error, stdout, stderr) => {
	console.log(stdout);
});
