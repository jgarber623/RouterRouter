/*!
 *  RouterRouter 2.0.0
 *
 *  A very small JavaScript routing library extracted from Backbone’s Router.
 *
 *  Source code available at: https://github.com/jgarber623/RouterRouter
 *
 *  Backbone is (c) 2011-2017 Jeremy Ashkenas, DocumentCloud
 *
 *  RouterRouter is (c) 2013-present Jason Garber (http://sixtwothree.org)
 *
 *  RouterRouter may be freely distributed under the MIT license.
 *
 *  For more about Backbone, visit: http://backbonejs.org
 */

(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.RouterRouter = factory();
  }
})(typeof self !== "undefined" ? self : this, function() {
  "use strict";
  var extractParameters = function(route, pathname) {
    return route.exec(pathname).slice(1).map(function(parameter) {
      return parameter ? decodeURIComponent(parameter) : null;
    });
  };
  var routeToRegExp = function(route) {
    route = route.replace(/[$.|]+?/g, "\\$&").replace(/\((.+?)\)/g, "(?:$1)?").replace(/:\w+/g, "([^/]+)").replace(/\*(\w+)?/g, "(.+?)");
    return new RegExp("^" + route + "$");
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
  return RouterRouter;
});