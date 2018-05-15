# RouterRouter

**A very small JavaScript routing library extracted from [Backbone's Router](http://backbonejs.org/docs/backbone.html#section-185).**

[![npm](https://img.shields.io/npm/v/@jgarber/routerrouter.svg?style=for-the-badge)](https://www.npmjs.com/package/@jgarber/routerrouter)
[![Downloads](https://img.shields.io/npm/dt/@jgarber/routerrouter.svg?style=for-the-badge)](https://www.npmjs.com/package/@jgarber/routerrouter)
[![Build](https://img.shields.io/travis/jgarber623/RouterRouter.svg?style=for-the-badge)](https://travis-ci.org/jgarber623/RouterRouter)
[![Maintainability](https://img.shields.io/codeclimate/maintainability/jgarber623/RouterRouter.svg?style=for-the-badge)](https://codeclimate.com/github/jgarber623/RouterRouter)
[![Coverage](https://img.shields.io/codeclimate/coverage/jgarber623/RouterRouter.svg?style=for-the-badge)](https://codeclimate.com/github/jgarber623/RouterRouter)

Using a modified version of Backbone's routing code, RouterRouter provides Backbone-style route definition while remaining a small, standalone, dependency-free library. RouterRouter maps specified routes (the value returned from `window.location.pathname`) to user-defined actions. This approach may be useful for websites with predictable URLs and modular, component-specific JavaScript.

### Key Features

- Inspired by Backbone's routing API
- Dependency-free
- AMD/Node module support

RouterRouter is also really tiny:

| Format                 | File Size   | Gzipped Size |
|:-----------------------|:------------|:-------------|
| Uncompressed (module)  | 1,439 bytes | 697 bytes    |
| Uncompressed (browser) | 1,756 bytes | 793 bytes    |
| Minified (browser)     | 1,138 bytes | 646 bytes    |

## Getting RouterRouter

You've got a couple options for adding RouterRouter to your project:

- [Download a tagged version](https://github.com/jgarber623/RouterRouter/tags) from GitHub and do it yourself _(old school)_.
- Install using [npm](https://www.npmjs.com/package/@jgarber/routerrouter): `npm install @jgarber/routerrouter --save`
- Install using [Yarn](https://yarnpkg.com/en/package/@jgarber/routerrouter): `yarn add @jgarber/routerrouter`
- Install using [Bower](https://bower.io/search/?q=routerrouter): `bower install routerrouter --save`

## Usage

### Basic

A basic example, matching a route:

```js
var router = new RouterRouter();

router.route('/posts', function() { // matches https://example.com/posts
  console.log('Hello!');
});
```

Another example, this time using a named parameter to match a route:

```js
var router = new RouterRouter();

router.route('/posts/:slug', function(slug) { // matches https://example.com/posts/hello-world
  console.log(slug); // logs 'hello-world'
});
```

RouterRouter supports a number of different matchers which are outlined below in the [Pattern Matching](#pattern-matching) section.

### Advanced

A more complex example, demonstrating an alternative method of defining routes and actions:

```js
var router = new RouterRouter({
  // Routes are defined in the `routes` object:
  routes: {
    // Actions may be defined inline:
    '/': function() {
      console.log('This route matches the root URL');
    },

    // Routes may also be mapped to named actions:
    '/posts': 'postsPageAction',

    // Matched patterns in routes are passed to actions
    // in the order they appear in the route:
    '/posts/:year/:month/:slug', 'postPageAction'
  },

  postPageAction: function(year, month, slug) {
    // Logs strings like '2018', '06', 'hello-world'
    console.log(year, month, slug);
  },

  postsPageAction: function() {
    console.log('This route matches the /posts URL');
  }
});
```

## Pattern Matching

RouterRouter will match URL patterns similar to [Backbone's Router](http://backbonejs.org/#Router) with the notable exception that routes _must_ begin with a slash (`/`).

**Pro Tip:** It's possible to define multiple routes and actions that match similar URLs (e.g. `/posts` and `/:section`). This could lead to confusion, though, so be judicious when defining routes and actions.

### String Matching

| Route                | Matched URLs |
|:---------------------|:-------------|
| `/`                  | https://example.com |
| `/posts`             | https://example.com/posts |
| `/posts/hello-world` | https://example.com/posts/hello-world |

### Named Parameters

Named parameters match patterns in routes and pass the captured values to the associated action for reuse. Captured values are passed to the action in the order they appear in the route. Named parameters are limited to strings of characters appearing _between_ slashes (`/`) in a URL.

| Route                   | Matched URLs                                | Matched Patterns |
|:------------------------|:--------------------------------------------|:-----------------|
| `/posts/:slug`          | https://example.com/posts/hello-world       | `hello-world` |
| `/:section/:subsection` | https://example.com/solar-systems/milky-way | `solar-systems`, `milky-way` |

### Wildcard Parameters

Wildcard parameters match patterns in routes _including_ slashes (`/`) in URLs. For clarity, wildcard parameters may optionally include a named identifier (e.g. `*wildcard_parameter`). Similar to named parameters, captured values are passed to the action in the order they appear in the route and may include slashes.

| Route                     | Matched URLs                                | Matched Patterns |
|:--------------------------|:--------------------------------------------|:-----------------|
| `/posts/*/06/*`           | https://example.com/posts/2018/06/23        | `2018`, `23` |
| `/posts/*years_months/23` | https://example.com/posts/2018/06/23        | `2018/06` |

### Optional Parameters

Optional parameters match patterns in routes conditionally and pass captured values to the specified action. By default, matched optional parameters _are not_ captured. In cases where an optional parameter _does not_ appear in the URL, `null` is passed to the action. Optional parameter matching is rather powerful and complex, so use this feature with care!

| Route              | Matched URLs                          | Matched Patterns |
|:-------------------|:--------------------------------------|:-----------------|
| `/posts(/)`        | https://example.com/posts             | |
|                    | https://example.com/posts/            | |
| `/posts(/:slug)`   | https://example.com/posts             | |
|                    | https://example.com/posts/hello-world | `hello-world` |
| `(/:section)/2018` | https://example.com/2018              | |
|                    | https://example.com/posts/2018        | `posts` |
|                    | https://example.com/archives/2018     | `archives` |

### Regular Expressions

RouterRouter supports route definitions using [regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions). Regular expression matching may be as simple or complex as necessary and non-passive captured groups will be passed to the mapped action in the order they appear in the regular expression.

**Pro Tip:** Routes defined using regular expressions are not limited to matching the _entire_ value of `window.location.pathname` and therefore do not need to begin with a slash (`/`). This feature can be used to interesting effect.

```js
var router = new RouterRouter();

router.route(/\/comments\/?$/, function() {
  console.log('This route matches URLs ending in /comments or /comments/');
});

router.route(/^\/(links|photos|posts)\/(?:.*)$/, function(section) {
  // Logs 'links', 'photos', or 'posts'
  console.log(section);
});
```

## Browser Support

RouterRouter works in all modern browsers. The library makes use of several new(ish) JavaScript methods, including:

- `Object.keys()` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys))
- `Array.map()` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map))

Internet Explorer added native support for these features in version 9. To avoid throwing JavaScript errors in browsers that don't support this method, you can [cut the mustard](http://responsivenews.co.uk/post/18948466399/cutting-the-mustard):

```js
if (Object.keys && Array.map) {
  // Your scripts here…
}
```

RouterRouter, in an effort to remain as lightweight and dependency-free as possible, leaves it up to you to choose whether or not to polyfill features for older browsers.

## Limitations

RouterRouter matches the portion of a URL returned by `window.location.pathname`. This _does not_ include other aspects of [the `Location` interface](https://developer.mozilla.org/en-US/docs/Web/API/location) like query parameters (e.g. `?search=why+does+the+sun+shine`). Within an action, the `Location` interface may be used directly (`window.location`) or indirectly:

```js
var router = new RouterRouter();

// Logs the internally cached version of `window.location`
console.log(router.location);
```

RouterRouter doesn't natively support the [HTML5 History API](http://diveintohtml5.info/history.html). It may be possible to use RouterRouter with this feature, but for now, keeping the library as small as possible remains the project's primary goal.

## Acknowledgments

Credit for the really difficult parts of RouterRouter goes to Jeremy Ashkenas, DocumentCloud, Investigative Reporters & Editors, and everyone else who has contributed code to Backbone.

RouterRouter is written and maintained by [Jason Garber](https://sixtwothree.org) and is another in a growing collection of small, curiously-named JavaScript utilities:

- [CashCash](https://github.com/jgarber623/CashCash), a very small DOM library inspired by [jQuery](https://jquery.com).
- [RadioRadio](https://github.com/jgarber623/RadioRadio), a very small [PubSub](https://en.wikipedia.org/wiki/Publish–subscribe_pattern) library.
- [TemplateTemplate](https://github.com/jgarber623/TemplateTemplate), a very small `<template>` manipulation library.

## License

Like Backbone, RouterRouter is freely available under the [MIT License](https://opensource.org/licenses/MIT). Use it, learn from it, fork it, improve it, change it, tailor it to your needs.
