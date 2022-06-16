/*!
 *  RouterRouter v3.0.1
 *
 *  A very small JavaScript routing library extracted from Backbone’s Router.
 *
 *  Source code available at: https://github.com/jgarber623/RouterRouter
 *
 *  (c) 2013-present Jason Garber (https://sixtwothree.org)
 *
 *  RouterRouter may be freely distributed under the MIT license.
 */
const extractParameters = (route, pathname) => route.exec(pathname).slice(1).map((parameter => parameter ? decodeURIComponent(parameter) : null));

const routeToRegExp = route => {
  route = route.replace(/[$.|]+?/g, "\\$&").replace(/\((.+?)\)/g, "(?:$1)?").replace(/:\w+/g, "([^/]+)").replace(/\*(\w+)?/g, "(.+?)");
  return new RegExp(`^${route}$`);
};

class RouterRouter {
  constructor(options = {}) {
    this.options = options;
    this.location = window.location;
    const routes = this.options.routes;
    if (routes) {
      Object.keys(routes).forEach((route => this.route(route, routes[route])));
    }
  }
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

export { RouterRouter as default };
