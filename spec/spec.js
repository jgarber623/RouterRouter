var assert = chai.assert;
var router = new RouterRouter();

var test = function(url, route, callback) {
	router.location = new Location(url);

	router.route(route, callback);
};

// Override browser's native Location object. See:
// https://github.com/jashkenas/backbone/blob/master/test/router.js#L13-L41
var Location = function(href) {
	this.replace(href);
};

Location.prototype = {
	parser: document.createElement('a'),

	replace: function(href) {
		this.parser.href = href;

		this.href = this.parser.href;
		this.hash = this.parser.hash;
		this.host = this.parser.host;
		this.search = this.parser.search;
		this.fragment = this.parser.fragment;
		this.pathname = this.parser.pathname;
		this.protocol = this.parser.protocol;

		// In IE, anchor.pathname does not contain a leading slash though
		// window.location.pathname does.
		if (!/^\//.test(this.pathname)) this.pathname = '/' + this.pathname;
	},

	toString: function() {
		return this.href;
	}
};

describe('RouterRouter', function() {
	it('should match an empty string.', function() {
		test('http://example.com', '', function() {
			assert.ok(true);
		});
	});

	it('should match a string.', function() {
		test('http://example.com/foo', 'foo', function() {
			assert.ok(true);
		});
	});

	it('should match a string with Unicode characters.', function() {
		test('http://example.com/motleycrüe', 'motleycrüe', function() {
			assert.ok(true);
		});
	});

	it('should match a string with newline characters.', function() {
		test('http://example.com/foo%0Abar', 'foo\nbar', function() {
			assert.ok(true);
		});
	});

	it('should match parameter parts.', function() {
		test('http://example.com/1/2/3', ':foo/:bar/:biz', function(foo, bar, biz) {
			assert.strictEqual(foo, '1');
			assert.strictEqual(bar, '2');
			assert.strictEqual(biz, '3');
		});
	});

	it('should match splat parts.', function() {
		test('http://example.com/path/to/some/file.txt', 'path/*foo', function(foo) {
			assert.strictEqual(foo, 'to/some/file.txt');
		});
	});

	describe('should match optional parts and', function() {
		it('returns the optional part when an optional part matches.', function() {
			test('http://example.com/blog/sample-post-title', ':foo(/:bar)', function(foo, bar) {
				assert.strictEqual(foo, 'blog');
				assert.strictEqual(bar, 'sample-post-title');
			});
		});

		it('returns null when an optional part does not match.', function() {
			test('http://example.com/blog', ':foo(/:bar)', function(foo, bar) {
				assert.strictEqual(foo, 'blog');
				assert.strictEqual(bar, null);
			});
		});
	});

	it('should match a regular expression.', function() {
		test('http://example.com/foo/bar/biz/baz', new RegExp(/^(.*?)\/baz$/), function(foo) {
			assert.strictEqual(foo, 'foo/bar/biz');
		});
	});
});