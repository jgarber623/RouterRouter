var assert = chai.assert;
var router = new RouterRouter();

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
		router.location = new Location('http://example.com');

		router.route('', function() {
			assert.ok(true);
		});
	});

	it('should match a string.', function() {
		router.location = new Location('http://example.com/foo');

		router.route('foo', function() {
			assert.ok(true);
		});
	});

	it('should match a string with Unicode characters.', function() {
		router.location = new Location('http://example.com/motleycrüe');

		router.route('motleycrüe', function() {
			assert.ok(true);
		});
	});

	it('should match a string with newline characters.', function() {
		router.location = new Location('http://example.com/foo%0Abar');

		router.route('foo\nbar', function() {
			assert.ok(true);
		});
	});

	it('should match parameter parts.', function() {
		router.location = new Location('http://example.com/1/2/3');

		router.route(':foo/:bar/:biz', function(foo, bar, biz) {
			assert.strictEqual(foo, '1');
			assert.strictEqual(bar, '2');
			assert.strictEqual(biz, '3');
		});
	});

	it('should match splat parts.', function() {
		router.location = new Location('http://example.com/path/to/some/file.txt');

		router.route('path/*foo', function(foo) {
			assert.strictEqual(foo, 'to/some/file.txt');
		});
	});

	describe('should match optional parts and', function() {
		it('returns the optional part when an optional part matches.', function() {
			router.location = new Location('http://example.com/blog/sample-post-title');

			router.route(':foo(/:bar)', function(foo, bar) {
				assert.strictEqual(foo, 'blog');
				assert.strictEqual(bar, 'sample-post-title');
			});
		});

		it('returns null when an optional part does not match.', function() {
			router.location = new Location('http://example.com/blog');

			router.route(':foo(/:bar)', function(foo, bar) {
				assert.strictEqual(foo, 'blog');
				assert.strictEqual(bar, null);
			});
		});
	});
});