/*!
 * @name RouterRouter
 * @version 5.0.0
 *
 * @file A very small JavaScript routing library extracted from Backbone’s Router.
 *
 * {@link https://github.com/jgarber623/RouterRouter}
 *
 * @copyright 2013 Jason Garber (https://sixtwothree.org)
 *
 * @license MIT
 */

// Given a RegExp'ed `route` and a `path`, return the array of extracted
// and decoded parameters. Empty or unmatched parameters will be treated
// as `null` to normalize cross-browser behavior.
const extractParameters = (route, pathname) => {
  return route.exec(pathname).slice(1).map((parameter) => {
    return parameter ? decodeURIComponent(parameter) : null;
  });
};

// Convert a route string into a regular expression suitable for matching
// against the current location's `pathname`.
const routeToRegExp = (route) => {
  route = route
    // escape RegExp reserved characters
    .replaceAll(/[$.|]+/g, "\\$&")
    // replace optional parameters with RegExp
    .replaceAll(/\((.+?)\)/g, "(?:$1)?")
    // replace named parameters with RegExp
    .replaceAll(/:\w+/g, "([^/]+)")
    // replace wildcard parameters with RegExp
    .replaceAll(/\*(\w+)?/g, "(.+?)");

  return new RegExp(`^${route}$`);
};

export default class RouterRouter {
  /**
   * Bind multiple routes to actions.
   *
   * @param {object} options An object containing a `routes` key whose value is
   *   an object. Optionally contains arbitrary string keys whose values are
   *   functions.
   * @param {object} options.routes An object whose keys are strings
   *   representing URLs to match against (which may contain named parameters,
   *   wildcards, and optional parameters). Values may be either functions or
   *   string values referencing keys in the `options` object.
   *
   * @example
   * new RouterRouter({
   *   routes: {
   *     "/": () => {
   *       console.log("This route matches the root URL");
   *     },
   *   },
   * });
   */
  constructor(options = {}) {
    this.options = options;
    this.location = window.location;

    const routes = this.options.routes;

    if (routes) {
      for (const route of Object.keys(routes)) {
        this.route(route, routes[route]);
      }
    }
  }

  /**
   * Manually bind a single route to an action.
   *
   * @param {string|RegExp} route The URL to match.
   * @param {Function} action A callback function to execute when `route`
   *     matches the current page's URL.
   *
   * @example
   * router.route("/search/:query/:page", (query, page) => {
   *   console.log(query, page);
   * });
   */
  route(route, action) {
    const pathname = decodeURIComponent(this.location.pathname);

    if (!(route instanceof RegExp)) {
      route = routeToRegExp(route);
    }

    if (typeof action === "string") {
      action = this.options[action];
    }

    if (route.test(pathname) && typeof action === "function") {
      action.apply(this, extractParameters(route, pathname));
    }
  }
}
