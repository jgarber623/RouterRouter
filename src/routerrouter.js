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

	// Bind all defined routes. We have to reverse the order of the routes
	// here to support behavior where the most general routes can be defined
	// at the bottom of the route map.
	var bindRoutes = function(routes) {
		if (routes) {
			var route,
				keys = Object.keys(routes);

			while (typeof (route = keys.pop()) !== 'undefined') {
				this.route(route, routes[route]);
			}
		}
	};

	// Given a route, and a URL fragment that it matches, return the array of
	// extracted decoded parameters. Empty or unmatched parameters will be
	// treated as `null` to normalize cross-browser behavior.
	var extractParameters = function(route, fragment) {
		var params = route.exec(fragment).slice(1);

		return params.map(function(param) {
			return param ? decodeURIComponent(param) : null;
		});
	};

	// Get the cross-browser normalized URL fragment, either from the URL,
	// the hash, or the override.
	var getFragment = function(fragment) {
		return fragment.replace(routeStripper, '').replace(trailingSlash, '');
	};

	// Method for determining the type of a given object.
	var isType = function(obj, name) {
		return Object.prototype.toString.call(obj) === '[object ' + name + ']';
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

		bindRoutes(this.options.routes);
	};

	// Manually bind a single named route to a callback. For example:
	//
	//   router.route('search/:query/p:num', 'search', function(query, num) {
	//     ...
	//   });
	//
	RouterRouter.prototype.route = function(route, name, callback) {
		if (!isType(route, 'RegExp')) {
			route = routeToRegExp(route);
		}

		if (isType(name, 'Function')) {
			callback = name;
			name = '';
		}

		if (!callback) {
			callback = this.options[name];
		}

		var fragment = getFragment(window.location.pathname);

		if (route.test(fragment)) {
			var args = extractParameters(route, fragment);

			if (isType(callback, 'Function')) {
				callback.apply(this, args);
			}
		}

		return this;
	};

	return RouterRouter;
}));