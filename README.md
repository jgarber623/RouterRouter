# RouterRouter

**A very small JavaScript routing library extracted from [Backbone's Router](http://backbonejs.org/docs/backbone.html#section-185).**

[![npm](https://img.shields.io/npm/v/@jgarber/routerrouter.svg?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@jgarber/routerrouter)
[![Downloads](https://img.shields.io/npm/dt/@jgarber/routerrouter.svg?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@jgarber/routerrouter)
[![Build](https://img.shields.io/github/actions/workflow/status/jgarber623/RouterRouter/ci.yml?branch=main&logo=github&style=for-the-badge)](https://github.com/jgarber623/RouterRouter/actions/workflows/ci.yml)

Using a modified version of Backbone's routing code, RouterRouter provides Backbone-style route definition while remaining a small, standalone, dependency-free library. RouterRouter maps specified routes (the value returned from `window.location.pathname`) to user-defined actions. This approach may be useful for websites with predictable URLs and modular, component-specific JavaScript.

### Key Features

- Inspired by Backbone's routing API
- Dependency-free
- JavaScript module (ESM), CommonJS, and browser global (`window.RouterRouter`) support

## Getting RouterRouter

You've got a couple options for adding RouterRouter to your project:

- [Download a release](https://github.com/jgarber623/RouterRouter/releases) from GitHub and do it yourself _(old school)_.
- Install using [npm](https://www.npmjs.com/package/@jgarber/routerrouter): `npm install @jgarber/routerrouter --save`
- Install using [Yarn](https://yarnpkg.com/en/package/@jgarber/routerrouter): `yarn add @jgarber/routerrouter`

## Usage

### Basic

A basic example, matching a route:

```js
const router = new RouterRouter();

// matches https://example.com/posts
router.route("/posts", () => console.log("Hello!"));
```

Another example, this time using a named parameter to match a route:

```js
const router = new RouterRouter();

// matches https://example.com/posts/hello-world and logs "hellow-world"
router.route("/posts/:slug", (slug) => console.log(slug));
```

RouterRouter supports a number of different matchers which are outlined below in the [Pattern Matching](#pattern-matching) section.

### Advanced

A more complex example, demonstrating an alternative method of defining routes and actions:

```js
const router = new RouterRouter({
  // Routes are defined in the `routes` object:
  routes: {
    // Actions may be defined inline:
    "/": () => {
      console.log("This route matches the root URL");
    },

    // Routes may also be mapped to named actions:
    "/posts": "postsPageAction",

    // Matched patterns in routes are passed to actions
    // in the order they appear in the route:
    "/posts/:year/:month/:slug", "postPageAction"
  },

  postPageAction: (year, month, slug) => {
    // Logs strings like "2018", "06", "hello-world"
    console.log(year, month, slug);
  },

  postsPageAction: () => {
    console.log("This route matches the /posts URL");
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

| Route                   | Matched URLs                                | Matched Patterns             |
|:------------------------|:--------------------------------------------|:-----------------------------|
| `/posts/:slug`          | https://example.com/posts/hello-world       | `hello-world`                |
| `/:section/:subsection` | https://example.com/solar-systems/milky-way | `solar-systems`, `milky-way` |

### Wildcard Parameters

Wildcard parameters match patterns in routes _including_ slashes (`/`) in URLs. For clarity, wildcard parameters may optionally include a named identifier (e.g. `*wildcard_parameter`). Similar to named parameters, captured values are passed to the action in the order they appear in the route and may include slashes.

| Route                     | Matched URLs                         | Matched Patterns |
|:--------------------------|:------------------------------------ |:-----------------|
| `/posts/*/06/*`           | https://example.com/posts/2018/06/23 | `2018`, `23`     |
| `/posts/*years_months/23` | https://example.com/posts/2018/06/23 | `2018/06`        |

### Optional Parameters

Optional parameters match patterns in routes conditionally and pass captured values to the specified action. By default, matched optional parameters _are not_ captured. In cases where an optional parameter _does not_ appear in the URL, `null` is passed to the action. Optional parameter matching is rather powerful and complex, so use this feature with care!

| Route              | Matched URLs                          | Matched Patterns |
|:-------------------|:--------------------------------------|:-----------------|
| `/posts(/)`        | https://example.com/posts             |                  |
|                    | https://example.com/posts/            |                  |
| `/posts(/:slug)`   | https://example.com/posts             |                  |
|                    | https://example.com/posts/hello-world | `hello-world`    |
| `(/:section)/2018` | https://example.com/2018              |                  |
|                    | https://example.com/posts/2018        | `posts`          |
|                    | https://example.com/archives/2018     | `archives`       |

### Regular Expressions

RouterRouter supports route definitions using [regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions). Regular expression matching may be as simple or complex as necessary and non-passive captured groups will be passed to the mapped action in the order they appear in the regular expression.

**Pro Tip:** Routes defined using regular expressions are not limited to matching the _entire_ value of `window.location.pathname` and therefore do not need to begin with a slash (`/`). This feature can be used to interesting effect.

```js
const router = new RouterRouter();

router.route(/\/comments\/?$/, () => {
  console.log("This route matches URLs ending in /comments or /comments/");
});

// Logs "links", "photos", or "posts"
router.route(/^\/(links|photos|posts)\/(?:.*)$/, (section) => console.log(section));
```

### Examples

For a full-featured RouterRouter demonstration, check out [the demo page](https://jgarber623.github.io/RouterRouter/example/) and [the example files](https://github.com/jgarber623/RouterRouter/tree/main/example).

## Browser Support

**RouterRouter works in modern browsers.** The library makes use of several new(ish) JavaScript features and, in an effort to remain as lightweight and dependency-free as possible, leaves it up to you to choose whether or not to polyfill features for older browsers.

## Limitations

RouterRouter matches the portion of a URL returned by `window.location.pathname`. This _does not_ include other aspects of [the `Location` interface](https://developer.mozilla.org/en-US/docs/Web/API/location) like query parameters (e.g. `?search=why+does+the+sun+shine`). Within an action, the `Location` interface may be used directly (`window.location`) or indirectly:

```js
const router = new RouterRouter();

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
