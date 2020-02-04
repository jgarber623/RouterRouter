// Given a RegExp'ed `route` and a `path`, return the array of extracted
// and decoded parameters. Empty or unmatched parameters will be treated
// as `null` to normalize cross-browser behavior.
const extractParameters = (route, pathname) => {
  return route.exec(pathname).slice(1).map(parameter => {
    return parameter ? decodeURIComponent(parameter) : null;
  });
};

// Convert a route string into a regular expression suitable for matching
// against the current location's `pathname`.
const routeToRegExp = route => {
  // escape RegExp reserved characters
  route = route.replace(/[$.|]+?/g, '\\$&')
    // replace optional parameters with RegExp
    .replace(/\((.+?)\)/g, '(?:$1)?')
    // replace named parameters with RegExp
    .replace(/:\w+/g, '([^/]+)')
    // replace wildcard parameters with RegExp
    .replace(/\*(\w+)?/g, '(.+?)');

  return new RegExp(`^${route}$`);
};

export default class RouterRouter {
  // Bind multiple routes to actions.
  //
  //   new RouterRouter({
  //     routes: {
  //       '/': () => {
  //         console.log('This route matches the root URL');
  //       },
  //     }
  //   });
  constructor(options = {}) {
    this.options = options;
    this.location = window.location;

    const routes = this.options.routes;

    if (routes) {
      Object.keys(routes).forEach(route => {
        return this.route(route, routes[route]);
      });
    }
  }

  // Manually bind a single route to an action.
  //
  //   router.route('/search/:query/:page', function(query, page) {
  //     console.log(query, page);
  //   });
  //
  route(route, action) {
    const pathname = decodeURIComponent(this.location.pathname);

    if (!(route instanceof RegExp)) {
      route = routeToRegExp(route);
    }

    if (typeof action === 'string') {
      action = this.options[action];
    }

    if (route.test(pathname) && typeof action === 'function') {
      action.apply(this, extractParameters(route, pathname));
    }
  }
}
