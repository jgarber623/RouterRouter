# RouterRouter

**A very small JavaScript routing library extracted from [Backbone's Router](http://backbonejs.org/docs/backbone.html#section-185).**

[![npm](https://img.shields.io/npm/v/@jgarber/routerrouter.svg?style=for-the-badge)](https://www.npmjs.com/package/@jgarber/routerrouter)
[![Bower](https://img.shields.io/bower/v/routerrouter.svg?style=for-the-badge)](https://bower.io/search/?q=routerrouter)
[![Downloads](https://img.shields.io/npm/dt/@jgarber/routerrouter.svg?style=for-the-badge)](https://www.npmjs.com/package/@jgarber/routerrouter)
[![Build](https://img.shields.io/travis/jgarber623/RouterRouter.svg?style=for-the-badge)](https://travis-ci.org/jgarber623/RouterRouter)
[![Maintainability](https://img.shields.io/codeclimate/maintainability/jgarber623/RouterRouter.svg?style=for-the-badge)](https://codeclimate.com/github/jgarber623/RouterRouter)
[![Coverage](https://img.shields.io/codeclimate/coverage/jgarber623/RouterRouter.svg?style=for-the-badge)](https://codeclimate.com/github/jgarber623/RouterRouter)

Using a modified version of Backbone's routing code, RouterRouter provides Backbone-style route definition while remaining a small, standalone, dependency-free library.

For more on RouterRouter's development, check out the [introductory post](http://sixtwothree.org/posts/finally-introducing-routerrouter-a-javascript-routing-library).

### Key Features

- Uses Backbone's routing API
- Dependency-free
- AMD/Node module support

RouterRouter is also really tiny:

<table>
  <tbody>
    <tr>
      <th>Uncompressed</th>
      <td>2,351 bytes</td>
    </tr>
    <tr>
      <th>Minified</th>
      <td>1,431 bytes</td>
    </tr>
    <tr>
      <th>Minified and gzipped</th>
      <td>820 bytes</td>
    </tr>
  </tbody>
</table>

## Getting RouterRouter

You've got a couple options for adding RouterRouter to your project:

- [Download a tagged version](https://github.com/jgarber623/RouterRouter/tags) from GitHub and do it yourself _(old school)_.
- Install using [npm](https://www.npmjs.com/package/@jgarber/routerrouter): `npm install @jgarber/routerrouter --save`
- Install using [Yarn](https://yarnpkg.com/en/package/@jgarber/routerrouter): `yarn add @jgarber/routerrouter`
- Install using [Bower](https://bower.io/search/?q=routerrouter): `bower install routerrouter --save`

## Pattern Matching

RouterRouter will match the same patterns as [Backbone's Router](http://backbonejs.org/#Router):

### Parameter Parts

`foo/:bar` will match a fragment of `foo/1234` and pass a value of `1234` to the specified action. Multiple named parameters can be used as well (each named parameter is passed to the action as a separate argument):

```
foo/:bar/:biz       // matches 'foo/1/2'
foo/:bar/page-:biz  // matches 'foo/1/page-2'
foo/:bar-:biz       // matches 'foo/1-2'
```

### Splat Parts

`foo/*bar` will match a fragment of `foo/1/2/3/4` and pass a value of `1/2/3/4` to the specified action.

### Optional Parts

`foo/:bar(/:biz)` will match fragments of `foo/1` and `foo/1/2`. In the first case, a value of `1` will be passed to the specified action. In the second case, values of `1` and `2` will be passed to the specified action as separate arguments.

### Regular Expressions

`/^(.*?)\/baz$/` will match a fragment of `foo/bar/biz/baz` and pass a value of `foo/bar/biz` to the specified action.

## Usage

### Basic

A basic example, matching a single route:

```js
var router = new RouterRouter();

router.route('foo/:bar', function(bar) { // matches http://example.com/foo/1234
  console.log(bar); // logs 1234
});
```

### Advanced

A more complex example, matching multiple routes each with their own callbacks:

```js
var router = new RouterRouter({
  routes: {
    'foo/:bar': 'whiskey', // matches http://example.com/foo/1234
    'biz/*baz': 'tango',   // matches http://example.com/biz/1/2/3/4
    '': 'foxtrot'          // matches http://example.com/
  },

  foxtrot: function() {
    console.log('This basic route matches the root URL.');
  },

  tango: function(baz) {
    console.log(baz); // logs 1/2/3/4
  },

  whiskey: function(bar) {
    console.log(bar); // logs 1234
  }
});
```

### Example

For a full-featured RouterRouter demonstration, check out [the included example file](https://github.com/jgarber623/RouterRouter/blob/master/example/index.html).

## Browser Support

RouterRouter works in all modern browsers. The library makes use of several new(ish) JavaScript methods, including:

- `Object.keys` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys))
- `Array.prototype.map()` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map))

Internet Explorer added native support for these features in version 9. To avoid throwing JavaScript errors in browsers that don't support this method, you can [cut the mustard](http://responsivenews.co.uk/post/18948466399/cutting-the-mustard):

```js
if (Object.keys && Array.map) {
  // Your scripts here…
}
```

RouterRouter, in an effort to remain as lightweight and dependency-free as possible, leaves it up to you to choose whether or not to polyfill features for older browsers.

## Limitations

RouterRouter doesn't (currently) support the [HTML5 History API](http://diveintohtml5.info/history.html). Support for this feature may be added in the future, but for now, keeping the library as small as possible remains the project's primary goal.

## Acknowledgments

Credit for the really difficult parts of RouterRouter goes to Jeremy Ashkenas, DocumentCloud, Investigative Reporters & Editors, and everyone else who has contributed code to Backbone.

RouterRouter is written and maintained by [Jason Garber](https://sixtwothree.org) and is another in a growing collection of small, curiously-named JavaScript utilities:

- [CashCash](https://github.com/jgarber623/CashCash), a very small DOM library inspired by [jQuery](https://jquery.com).
- [RadioRadio](https://github.com/jgarber623/RadioRadio), a very small [PubSub](https://en.wikipedia.org/wiki/Publish–subscribe_pattern) library.
- [TemplateTemplate](https://github.com/jgarber623/TemplateTemplate), a very small `<template>` manipulation library.

## License

Like Backbone, RouterRouter is freely available under the [MIT License](https://opensource.org/licenses/MIT). Use it, learn from it, fork it, improve it, change it, tailor it to your needs.
