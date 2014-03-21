/*!
 *  RouterRouter
 *
 *  A very basic JavaScript routing library extracted from Backbone's Router.
 *
 *  Lovingly derived by Jason Garber (http://sixtwothree.org)
 *  Source code available at: https://github.com/jgarber623/RouterRouter
 *
 *  Backbone is
 *  (c) 2011-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 *
 *  RouterRouter is
 *  (c) 2013—present Jason Garber
 *
 *  Like Backbone, RouterRouter may be freely distributed under the MIT license.
 *
 *  For more about Backbone, visit: http://backbonejs.org
 */

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.RouterRouter = factory();
	}
}(this, function() {
	'use strict';

	// Cached regular expressions for matching named param parts and splatted
	// parts of route strings.
	var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g,
		namedParam = /(\(\?)?:\w+/g,
		optionalParam = /\((.*?)\)/g,
		splatParam = /\*\w+/g,

		// Cached regex for stripping a leading hash/slash and trailing space.
		routeStripper = /^[#\/]|\s+$/g,

		// Cached regex for removing a trailing slash.
		trailingSlash = /\/$/;

	// Method for determining the type of a given object.
	var isType = function(obj, name) {
		return Object.prototype.toString.call(obj) === '[object ' + name + ']';
	};

	var RouterRouter = function(options) {
		this.options = (typeof options !== 'undefined') ? options : {};

		if (this.options.routes) {
			this.routes = this.options.routes;
		}

		this.location = window.location;

		this._bindRoutes();
	};

	RouterRouter.prototype = {
		// Bind all defined routes. We have to reverse the order of the routes
		// here to support behavior where the most general routes can be defined
		// at the bottom of the route map.
		_bindRoutes: function() {
			if (this.routes) {
				var route,
					routes = Object.keys(this.routes);

				while (typeof (route = routes.pop()) !== 'undefined') {
					this.route(route, this.routes[route]);
				}
			}
		},

		// Given a route, and a URL fragment that it matches, return the array of
		// extracted decoded parameters. Empty or unmatched parameters will be
		// treated as `null` to normalize cross-browser behavior.
		_extractParameters: function(route, fragment) {
			var params = route.exec(fragment).slice(1);

			return params.map(function(param) {
				return param ? decodeURIComponent(param) : null;
			});
		},

		// Get the cross-browser normalized URL fragment, either from the URL,
		// the hash, or the override.
		_getFragment: function(fragment) {
			return fragment.replace(routeStripper, '').replace(trailingSlash, '');
		},

		// Convert a route string into a regular expression, suitable for matching
		// against the current location hash.
		_routeToRegExp: function(route) {
			route = route.replace(escapeRegExp, '\\$&')
				.replace(optionalParam, '(?:$1)?')
				.replace(namedParam, function(match, optional) {
					return optional ? match : '([^/?]+)';
				})
				.replace(splatParam, '([^?]*?)');

			return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
		},

		// Manually bind a single named route to a callback. For example:
		//
		//   router.route('search/:query/p:num', 'search', function(query, num) {
		//     ...
		//   });
		//
		route: function(route, name, callback) {
			if (!isType(route, 'RegExp')) {
				route = this._routeToRegExp(route);
			}

			if (isType(name, 'Function')) {
				callback = name;
				name = '';
			}

			if (!callback) {
				callback = this.options[name];
			}

			var fragment = this._getFragment(this.location.pathname);

			if (route.test(fragment)) {
				var args = this._extractParameters(route, fragment);

				if (isType(callback, 'Function')) {
					callback.apply(this, args);
				}
			}

			return this;
		}
	};

	return RouterRouter;
}));