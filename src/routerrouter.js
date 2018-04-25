(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.RouterRouter = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  // Given a regexp'ed `route` and a `path`, return the array of extracted
  // and decoded parameters. Empty or unmatched parameters will be treated
  // as `null` to normalize cross-browser behavior.
  var extractParameters = function(route, pathname) {
    return route.exec(pathname).slice(1).map(function(parameter) {
      return parameter ? decodeURIComponent(parameter) : null;
    });
  };

  // Convert a route string into a regular expression suitable for matching
  // against the current location's `pathname`.
  var routeToRegExp = function(route) {
    // escape RegExp reserved characters
    route = route.replace(/[$.|]+?/g, '\\$&')
      // replace optional parameters with RegExp
      .replace(/\((.+?)\)/g, '(?:$1)?')
      // replace named parameters with RegExp
      .replace(/:\w+/g, '([^/]+)')
      // replace wildcard parameters with RegExp
      .replace(/\*(\w+)?/g, '(.+?)');

    return new RegExp('^' + route + '$');
  };

  var RouterRouter = function(options) {
    this.options = options || {};

    var routes = this.options.routes;

    if (routes) {
      Object.keys(routes).forEach(function(route) {
        this.route(route, routes[route]);
      }.bind(this));
    }
  };

  RouterRouter.prototype = {
    // Capture current location for internal use.
    location: window.location,

    // Manually bind a single route to an action.
    //
    //   router.route('/search/:query/:page', function(query, page) {
    //     console.log(query, page);
    //   });
    //
    route: function(route, action) {
      var pathname = decodeURIComponent(this.location.pathname);

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
  };

  return RouterRouter;
}));
