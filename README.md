# RouterRouter

RouterRouter is a very basic JavaScript routing library extracted from [Backbone's Router](http://backbonejs.org/docs/backbone.html#section-143). Using a modified version of Backbone's routing code, RouterRouter provides Backbone-style route definition while remaining a small, standalone, dependency-free library.

### Key Features

- Dependency-free
- AMD/CommonJS module support
- Uses Backbone's routing API


## Getting RouterRouter

Adding RouterRouter to your project is easy! You've got a couple options:

- [Download a tagged version](https://github.com/jgarber623/RouterRouter/tags) from GitHub and do it yourself _(old school)_.
- Install via [Bower](http://bower.io/): `bower install routerrouter`


## Usage

### Basic

The most basic example, matching a single route:

	var router = new RouterRouter();

	router.route('foo/:bar', function(bar) { // matches http://example.com/foo/1234
		console.log(bar); // logs 1234
	});

### Advanced

A more complex example, matching multiple routes each with their own callbacks:

	var router = new RouterRouter({
		routes: {
			'foo/:bar': 'whiskey', // matches http://example.com/foo/1234
			'biz/*baz': 'tango',   // matches http://example.com/biz/1/2/3/4
			'': 'foxtrot'          // matches http://example.com/
		},

		foxtrot: function() {
			console.log('This very basic route matches the root URL.');
		},

		tango: function(baz) {
			console.log(baz); // logs 1/2/3/4
		},

		whiskey: function(bar) {
			console.log(bar); // logs 1234
		}
	});


## Browser Support

RouterRouter works in all modern browsers. The library makes use of several new(ish) JavaScript methods, including:

- `Object.keys` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys))
- `Array.prototype.map()` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map))

Internet Explorer added native support for these features in version 9. Polyfills for older versions of IE are available on the above linked MDN pages. RouterRouter, in an effort to remain as lightweight and dependency-free as possible, leaves it to the developer to choose to polyfill older versions of IE.


## Authors

Credit for the really difficult parts of RouterRouter goes to Jeremy Ashkenas, DocumentCloud, Investigative Reporters & Editors, and everyone else who has contributed code to Backbone.

RouterRouter is written and maintained by [@jgarber623](https://github.com/jgarber623).


## License

Like Backbone, RouterRouter is freely available under the [MIT License](http://opensource.org/licenses/MIT). Use it, learn from it, fork it, improve it, change it, tailor it to your needs.