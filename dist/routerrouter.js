/*!
 *  RouterRouter 1.0.2
 *
 *  A very basic JavaScript routing library extracted from Backbone’s Router.
 *
 *  Lovingly derived by Jason Garber (http://sixtwothree.org)
 *  Source code available at: https://github.com/jgarber623/RouterRouter
 *
 *  Backbone is
 *  (c) 2011-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 *
 *  RouterRouter is
 *  (c) 2013-2016 Jason Garber
 *
 *  Like Backbone, RouterRouter may be freely distributed under the MIT license.
 *
 *  For more about Backbone, visit: http://backbonejs.org
 */

(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    root.RouterRouter = factory();
  }
})(this, function() {
  "use strict";
  var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g, namedParam = /(\(\?)?:\w+/g, optionalParam = /\((.*?)\)/g, splatParam = /\*\w+/g, routeStripper = /^[#\/]|\s+$/g, trailingSlash = /\/$/;
  var extractParameters = function(route, fragment) {
    return route.exec(fragment).slice(1).map(function(param) {
      return param ? decodeURIComponent(param) : null;
    });
  };
  var routeToRegExp = function(route) {
    route = route.replace(escapeRegExp, "\\$&").replace(optionalParam, "(?:$1)?").replace(namedParam, function(match, optional) {
      return optional ? match : "([^/?]+)";
    }).replace(splatParam, "([^?]*?)");
    return new RegExp("^" + route + "(?:\\?([\\s\\S]*))?$");
  };
  var RouterRouter = function(options) {
    this.options = options || {};
    var routes = this.options.routes;
    if (routes) {
      var route, keys = Object.keys(routes);
      while (typeof (route = keys.pop()) !== "undefined") {
        this.route(route, routes[route]);
      }
    }
  };
  RouterRouter.prototype.route = function(route, name, callback) {
    var fragment = window.location.pathname.replace(routeStripper, "").replace(trailingSlash, "");
    if (!(route instanceof RegExp)) {
      route = routeToRegExp(route);
    }
    if (typeof name === "function") {
      callback = name;
      name = "";
    }
    if (!callback) {
      callback = this.options[name];
    }
    if (route.test(fragment) && typeof callback === "function") {
      callback.apply(this, extractParameters(route, fragment));
    }
    return this;
  };
  return RouterRouter;
});