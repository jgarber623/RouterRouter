/*!
 *  RouterRouter 1.0.0
 *
 *  A very basic JavaScript routing library extracted from Backbone’s Router.
 *
 *  Lovingly derived by Jason Garber (http://sixtwothree.org)
 *  Source code available at: https://github.com/jgarber623/RouterRouter
 *
 *  Backbone is
 *  (c) 2011-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 *
 *  RouterRouter is
 *  (c) 2013—present Jason Garber
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
  var bindRoutes = function(routes) {
    if (routes) {
      var route, keys = Object.keys(routes);
      while (typeof (route = keys.pop()) !== "undefined") {
        this.route(route, routes[route]);
      }
    }
  };
  var extractParameters = function(route, fragment) {
    var params = route.exec(fragment).slice(1);
    return params.map(function(param) {
      return param ? decodeURIComponent(param) : null;
    });
  };
  var getFragment = function(fragment) {
    return fragment.replace(routeStripper, "").replace(trailingSlash, "");
  };
  var isType = function(obj, name) {
    return Object.prototype.toString.call(obj) === "[object " + name + "]";
  };
  var routeToRegExp = function(route) {
    route = route.replace(escapeRegExp, "\\$&").replace(optionalParam, "(?:$1)?").replace(namedParam, function(match, optional) {
      return optional ? match : "([^/?]+)";
    }).replace(splatParam, "([^?]*?)");
    return new RegExp("^" + route + "(?:\\?([\\s\\S]*))?$");
  };
  var RouterRouter = function(options) {
    this.options = typeof options !== "undefined" ? options : {};
    bindRoutes(this.options.routes);
  };
  RouterRouter.prototype.route = function(route, name, callback) {
    if (!isType(route, "RegExp")) {
      route = routeToRegExp(route);
    }
    if (isType(name, "Function")) {
      callback = name;
      name = "";
    }
    if (!callback) {
      callback = this.options[name];
    }
    var fragment = getFragment(window.location.pathname);
    if (route.test(fragment)) {
      var args = extractParameters(route, fragment);
      if (isType(callback, "Function")) {
        callback.apply(this, args);
      }
    }
    return this;
  };
  return RouterRouter;
});