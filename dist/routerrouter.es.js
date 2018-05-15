/*!
 *  RouterRouter v2.1.0
 *
 *  A very small JavaScript routing library extracted from Backbone’s Router.
 *
 *  Source code available at: https://github.com/jgarber623/RouterRouter
 *
 *  (c) 2013-present Jason Garber (http://sixtwothree.org)
 *
 *  RouterRouter may be freely distributed under the MIT license.
 */

function extractParameters(route, pathname) {
  return route.exec(pathname).slice(1).map(function(parameter) {
    return parameter ? decodeURIComponent(parameter) : null;
  });
}

function routeToRegExp(route) {
  route = route.replace(/[$.|]+?/g, "\\$&").replace(/\((.+?)\)/g, "(?:$1)?").replace(/:\w+/g, "([^/]+)").replace(/\*(\w+)?/g, "(.+?)");
  return new RegExp("^" + route + "$");
}

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
  location: window.location,
  route: function(route, action) {
    var pathname = decodeURIComponent(this.location.pathname);
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
};

export default RouterRouter;
