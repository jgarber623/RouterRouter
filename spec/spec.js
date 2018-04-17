describe('RouterRouter', () => {
  let callback;
  let router;

  it('is a function', () => {
    expect(typeof RouterRouter).toBe('function');
  });

  describe('.route()', () => {
    beforeAll(() => {
      router = new RouterRouter();
    });

    beforeEach(() => {
      callback = jasmine.createSpy('callback');
    });

    it('is a function', () => {
      expect(typeof RouterRouter.prototype.route).toBe('function');
    });

    describe('string matching', () => {
      it('matches an empty string', () => {
        router.location = new Location('http://example.com');
        router.route('', callback);

        expect(callback).toHaveBeenCalled();
      });

      it('matches a string', () => {
        router.location = new Location('http://example.com/foo');
        router.route('foo', callback);

        expect(callback).toHaveBeenCalled();
      });

      it('matches a string containing Unicode characters', () => {
        router.location = new Location('http://example.com/motleycrüe');
        router.route('motleycrüe', callback);

        expect(callback).toHaveBeenCalled();
      });

      it('matches a string containing emoji characters', () => {
        router.location = new Location('http://example.com/🤔');
        router.route('🤔', callback);

        expect(callback).toHaveBeenCalled();
      });

      it('matches a string containing newline characters', () => {
        router.location = new Location('http://example.com/foo%0Abar')
        router.route('foo\nbar', callback);

        expect(callback).toHaveBeenCalled();
      });
    });

    describe('named parameter matching', () => {
      it('matches a single named parameter', () => {
        router.location = new Location('http://example.com/1');
        router.route(':foo', callback);

        expect(callback).toHaveBeenCalledWith('1');
      });

      it('matches multiple named parameters', () => {
        router.location = new Location('http://example.com/1/2/3');
        router.route(':foo/:bar/:biz', callback);

        expect(callback).toHaveBeenCalledWith('1', '2', '3');
      });
    });

    describe('wildcard parameter matching', () => {
      it('matches a single wildcard parameter', () => {
        router.location = new Location('http://example.com/path/to/some/file.txt');
        router.route('path/*foo', callback);

        expect(callback).toHaveBeenCalledWith('to/some/file.txt');
      });

      it('matches multiple wildcard parameters', () => {
        router.location = new Location('http://example.com/path/to/some/file.txt');
        router.route('path/*foo/*bar', callback);

        expect(callback).toHaveBeenCalledWith('to', '/some/file.txt');
      });
    });

    describe('optional parameters matching', () => {
      it('matches a single optional parameter', () => {
        router.location = new Location('http://example.com/blog/sample-post-title');
        router.route(':foo(/:bar)', callback);

        expect(callback).toHaveBeenCalledWith('blog', 'sample-post-title');
      });

      it('matches multiple optional parameters', () => {
        router.location = new Location('http://example.com/blog/sample-post-title/comments');
        router.route(':foo(/:bar)(/:biz)', callback);

        expect(callback).toHaveBeenCalledWith('blog', 'sample-post-title', 'comments');
      });

      it('handles missing optional parameters', () => {
        router.location = new Location('http://example.com/blog');
        router.route(':foo(/:bar)', callback);

        expect(callback).toHaveBeenCalledWith('blog', null);
      });
    });

    describe('regular expression matching', () => {
      it('matches a single capture group', () => {
        router.location = new Location('http://example.com/foo/bar');
        router.route(new RegExp(/^(.*?)\/bar$/), callback);

        expect(callback).toHaveBeenCalledWith('foo');
      });

      it('matches multiple capture groups', () => {
        router.location = new Location('http://example.com/foo/bar');
        router.route(new RegExp(/^(.*?)\/(.*?)$/), callback);

        expect(callback).toHaveBeenCalledWith('foo', 'bar')
      });

      it('ignores non-capture groups', () => {
        router.location = new Location('http://example.com/foo/bar/biz');
        router.route(new RegExp(/^(.*?)\/(?:.*?)\/(.*?)$/), callback);

        expect(callback).toHaveBeenCalledWith('foo', 'biz');
      });
    });
  });
});
