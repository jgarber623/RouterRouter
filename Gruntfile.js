module.exports = function(grunt) {
	require('load-grunt-config')(grunt, {
		configPath: __dirname + '/tasks'
	});

	grunt.registerTask('default', ['build']);
	grunt.registerTask('build', ['copy', 'uglify:main', 'uglify:minified']);
	grunt.registerTask('test', ['mocha']);
};