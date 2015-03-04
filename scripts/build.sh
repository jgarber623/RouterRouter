#!/bin/sh

PREAMBLE="/*!
 *  RouterRouter 0.2.4
 *
 *  A very basic JavaScript routing library extracted from Backbone's Router.
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
"

uglifyjs src/routerrouter.js --beautify 'indent-level=2' --preamble "$PREAMBLE" --output dist/routerrouter.js
uglifyjs src/routerrouter.js --compress --mangle --preamble "$PREAMBLE" --output dist/routerrouter.min.js