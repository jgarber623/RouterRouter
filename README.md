# RouterRouter

RouterRouter is a very basic JavaScript routing library extracted from [Backbone's Router](http://backbonejs.org/docs/backbone.html#section-143). Using a modified version of Backbone's routing code, RouterRouter provides Backbone-style route definition while remaining a small, standalone, dependency-free library.

For more on RouterRouter's development, check out the [introductory post](http://sixtwothree.org/posts/finally-introducing-routerrouter-a-javascript-routing-library).

### Key Features

- Dependency-free
- AMD/CommonJS module support
- Uses Backbone's routing API

RouterRouter is also really tiny:

<table>
	<tbody>
		<tr>
			<th>Uncompressed</th>
			<td>2,915 bytes</td>
		</tr>
		<tr>
			<th>Minified</th>
			<td>1,827 bytes</td>
		</tr>
		<tr>
			<th>Minifed and gzipped</th>
			<td>982 bytes</td>
		</tr>
	</tbody>
</table>


## Getting RouterRouter

Adding RouterRouter to your project is easy! You've got a couple options:

- [Download a tagged version](https://github.com/jgarber623/RouterRouter/tags) from GitHub and do it yourself _(old school)_.
- Install via [Bower](http://bower.io/): `bower install routerrouter`
- Install via [npm](https://www.npmjs.com/): `npm install routerrouter`


## Pattern Matching

RouterRouter will match the same patterns as [Backbone's Router](http://backbonejs.org/#Router):

### Parameter Parts

`foo/:bar` will match a fragment of `foo/1234` and pass a value of `1234` to the specified action. Multiple named parameters can be used as well (each named parameter is passed to the action as a separate argument):

	foo/:bar/:biz       // matches 'foo/1/2'
	foo/:bar/page-:biz  // matches 'foo/1/page-2'
	foo/:bar-:biz       // matches 'foo/1-2'

### Splat Parts

`foo/*bar` will match a fragment of `foo/1/2/3/4` and pass a value of `1/2/3/4` to the specified action.

### Optional Parts

`foo/:bar(/:biz)` will match fragments of `foo/1` and `foo/1/2`. In the first case, a value of `1` will be passed to the specified action. In the second case, values of `1` and `2` will be passed to the specified action as separate arguments.

### Regular Expressions

`/^(.*?)\/baz$/` will match a fragment of `foo/bar/biz/baz` and pass a value of `foo/bar/biz` to the specified action.


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

Internet Explorer added native support for these features in version 9, but if you wish to support older versions of IE, check out the polyfills available on the above linked MDN pages. RouterRouter, in an effort to remain as lightweight and dependency-free as possible, leaves it up to you to choose to polyfill older versions of IE.


## Limitations

RouterRouter doesn't (currently) support the [HTML5 History API](http://diveintohtml5.info/history.html). Support for this feature may be added in the future, but for now, keeping the library as small as possible remains the project's primary goal.


## Acknowledgments

Credit for the really difficult parts of RouterRouter goes to Jeremy Ashkenas, DocumentCloud, Investigative Reporters & Editors, and everyone else who has contributed code to Backbone.

Special thanks to [@nhunzaker](https://github.com/nhunzaker) for his guidance on testing and to [Viget](http://viget.com/) for their encouragement and commitment to open source projects.

RouterRouter is written and maintained by [@jgarber623](https://github.com/jgarber623).


## License

Like Backbone, RouterRouter is freely available under the [MIT License](http://opensource.org/licenses/MIT). Use it, learn from it, fork it, improve it, change it, tailor it to your needs.