// Override browser's native Location object. See:
// https://github.com/jashkenas/backbone/blob/master/test/router.js#L13-L42
const Location = function(href) {
  this.replace(href);
};

Location.prototype = {
  parser: document.createElement('a'),

  replace: function(href) {
    this.parser.href = href;

    this.href = this.parser.href;
    this.hash = this.parser.hash;
    this.host = this.parser.host;
    this.search = this.parser.search;
    this.fragment = this.parser.fragment;
    this.pathname = this.parser.pathname;
    this.protocol = this.parser.protocol;

    // In IE, anchor.pathname does not contain a leading slash though
    // window.location.pathname does.
    if (!/^\//.test(this.pathname)) this.pathname = '/' + this.pathname;
  },

  toString: function() {
    return this.href;
  }
};
