#!/usr/bin/env node

var spawn = require('child_process').spawn;

spawn('mocha-phantomjs', ['test/runner.html'], { stdio: 'inherit' });