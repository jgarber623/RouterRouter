var expect = chai.expect;
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
		isIndex = false;

		router.location = new Location('http://example.com');

		router.route('', function() {
			isIndex = true;
		});

		expect(isIndex).to.equal(true);
	});

	it('should match parameter parts.', function() {
		router.location = new Location('http://example.com/1/2/3');

		router.route(':foo/:bar/:biz', function(foo, bar, biz) {
			expect(foo).to.equal('1');
			expect(bar).to.equal('2');
			expect(biz).to.equal('3');
		});
	});

	it('should match splat parts.', function() {
		router.location = new Location('http://example.com/path/to/some/file.txt');

		router.route('path/*foo', function(foo) {
			expect(foo).to.equal('to/some/file.txt');
		});
	});

	it('should match optional parts.', function() {
		router.location = new Location('http://example.com/blog/sample-post-title');

		router.route(':foo(/:bar)', function(foo, bar) {
			expect(foo).to.equal('blog');
			expect(bar).to.equal('sample-post-title');
		});

		router.location = new Location('http://example.com/blog');

		router.route(':foo(/:bar)', function(foo, bar) {
			expect(foo).to.equal('blog');
			expect(bar).to.equal(null);
		});
	});
});