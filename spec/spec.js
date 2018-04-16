describe('RouterRouter', () => {
  const router = new RouterRouter();

  let callback;

  it('is a function', () => {
    expect(typeof RouterRouter).toBe('function');
  });

  describe('.route()', () => {
    beforeEach(() => {
      callback = jasmine.createSpy('callback');
    });

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

    it('matches a string containing newline characters', () => {
      router.location = new Location('http://example.com/foo%0Abar')
      router.route('foo\nbar', callback);

      expect(callback).toHaveBeenCalled();
    });

    it('matches parameter parts', () => {
      router.location = new Location('http://example.com/1/2/3');
      router.route(':foo/:bar/:biz', callback);

      expect(callback).toHaveBeenCalledWith('1', '2', '3');
    });

    it('matches splat parts', () => {
      router.location = new Location('http://example.com/path/to/some/file.txt');
      router.route('path/*foo', callback);

      expect(callback).toHaveBeenCalledWith('to/some/file.txt');
    });

    describe('when optional parts do not exist', () => {
      it('returns null', () => {
        router.location = new Location('http://example.com/blog');
        router.route(':foo(/:bar)', callback);

        expect(callback).toHaveBeenCalledWith('blog', null);
      });
    });

    describe('when optional parts exist', () => {
      it('matches optional parts', () => {
        router.location = new Location('http://example.com/blog/sample-post-title');
        router.route(':foo(/:bar)', callback);

        expect(callback).toHaveBeenCalledWith('blog', 'sample-post-title');
      });
    });

    it('matches a regular expression', () => {
      router.location = new Location('http://example.com/foo/bar/biz/baz');
      router.route(new RegExp(/^(.*?)\/baz$/), callback);

      expect(callback).toHaveBeenCalledWith('foo/bar/biz');
    });
  });
});
