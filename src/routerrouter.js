(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof module === 'object' && module.exports) {
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

	// Given a route, and a URL fragment that it matches, return the array of
	// extracted decoded parameters. Empty or unmatched parameters will be
	// treated as `null` to normalize cross-browser behavior.
	var extractParameters = function(route, fragment) {
		return route.exec(fragment).slice(1).map(function(param) {
			return param ? decodeURIComponent(param) : null;
		});
	};

	// Convert a route string into a regular expression, suitable for matching
	// against the current location hash.
	var routeToRegExp = function(route) {
		route = route.replace(escapeRegExp, '\\$&')
			.replace(optionalParam, '(?:$1)?')
			.replace(namedParam, function(match, optional) {
				return optional ? match : '([^/?]+)';
			})
			.replace(splatParam, '([^?]*?)');

		return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
	};

	var RouterRouter = function(options) {
		this.options = options || {};

		var routes = this.options.routes;

		if (routes) {
			var route,
				keys = Object.keys(routes);

			// Bind all defined routes. We have to reverse the order of the routes
			// here to support behavior where the most general routes can be defined
			// at the bottom of the route map.
			while (typeof (route = keys.pop()) !== 'undefined') {
				this.route(route, routes[route]);
			}
		}
	};

	// Manually bind a single named route to a callback. For example:
	//
	//   router.route('search/:query/p:num', 'search', function(query, num) {
	//     ...
	//   });
	//
	RouterRouter.prototype.route = function(route, name, callback) {
		var fragment = window.location.pathname.replace(routeStripper, '').replace(trailingSlash, '');

		if (!(route instanceof RegExp)) {
			route = routeToRegExp(route);
		}

		if (typeof name === 'function') {
			callback = name;
			name = '';
		}

		if (!callback) {
			callback = this.options[name];
		}

		if (route.test(fragment) && typeof callback === 'function') {
			callback.apply(this, extractParameters(route, fragment));
		}

		return this;
	};

	return RouterRouter;
}));
