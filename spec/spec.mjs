import RouterRouter from '../dist/routerrouter.mjs';

describe('RouterRouter', () => {
  let router;
  let action;

  beforeAll(() => {
    router = new RouterRouter();
  });

  beforeEach(() => {
    action = jasmine.createSpy('action');
  });

  describe('string matching', () => {
    it('matches a slash', () => {
      router.location = new Location('https://example.com');
      router.route('/', action);

      expect(action).toHaveBeenCalled();
    });

    it('matches a string', () => {
      router.location = new Location('https://example.com/foo');
      router.route('/foo', action);

      expect(action).toHaveBeenCalled();
    });

    it('treats trailing slashes as unique URLs', () => {
      router.location = new Location('https://example.com/foo/');
      router.route('/foo', action);

      expect(action).not.toHaveBeenCalled();
    });

    it('matches a string containing special characters', () => {
      router.location = new Location('https://example.com/$foo/~bar/@=|biz!buz.html');
      router.route('/$foo/~bar/@=|biz!buz.html', action);

      expect(action).toHaveBeenCalled();
    });

    it('matches a string containing encoded characters', () => {
      router.location = new Location('https://example.com/foo%2Fbar')
      router.route('/foo/bar', action);

      expect(action).toHaveBeenCalled();
    });

    it('matches a string containing Unicode characters', () => {
      router.location = new Location('https://example.com/föö');
      router.route('/föö', action);

      expect(action).toHaveBeenCalled();
    });

    it('matches a string containing emoji characters', () => {
      router.location = new Location('https://example.com/🤔');
      router.route('/🤔', action);

      expect(action).toHaveBeenCalled();
    });

    it('matches a string containing newline characters', () => {
      router.location = new Location('https://example.com/foo%0Abar')
      router.route('/foo\nbar', action);

      expect(action).toHaveBeenCalled();
    });
  });

  describe('named parameter matching', () => {
    it('matches a single named parameter', () => {
      router.location = new Location('https://example.com/posts/1');
      router.route('/posts/:id', action);

      expect(action).toHaveBeenCalledWith('1');
    });

    it('matches multiple named parameters', () => {
      router.location = new Location('https://example.com/posts/1');
      router.route('/:section/:id', action);

      expect(action).toHaveBeenCalledWith('posts', '1');
    });

    it('matches a complex named parameter', () => {
      router.location = new Location('https://example.com/posts/a-sample-post-name');
      router.route('/posts/a-:named_parameter-post-name', action);

      expect(action).toHaveBeenCalledWith('sample');
    });

    it('does not match a named parameter containing invalid characters', () => {
      router.location = new Location('https://example.com/posts/1');
      router.route('/posts/:🤔', action);

      expect(action).not.toHaveBeenCalled();
    });
  });

  describe('wildcard parameter matching', () => {
    it('matches a single wildcard parameter', () => {
      router.location = new Location('https://example.com/foo/bar/biz/baz');
      router.route('/*wildcard_parameter/baz', action);

      expect(action).toHaveBeenCalledWith('foo/bar/biz');
    });

    it('matches multiple wildcard parameters', () => {
      router.location = new Location('https://example.com/foo/bar/biz/baz');
      router.route('/foo/*/biz/*', action);

      expect(action).toHaveBeenCalledWith('bar', 'baz');
    });
  });

  describe('optional parameter matching', () => {
    it('matches a single optional parameter', () => {
      router.location = new Location('https://example.com/foo');
      router.route('/foo(/)', action);

      expect(action).toHaveBeenCalled();
    });

    it('matches multiple optional parameters', () => {
      router.location = new Location('https://example.com/foo/bar/biz');
      router.route('/foo(/bar)(/biz)', action);

      expect(action).toHaveBeenCalled();
    });

    it('matches a single optional named parameter', () => {
      router.location = new Location('https://example.com/foo/bar');
      router.route('/foo(/:optional_parameter)', action);

      expect(action).toHaveBeenCalledWith('bar');
    });

    it('matches multiple optional named parameters', () => {
      router.location = new Location('https://example.com/foo');
      router.route('(/:optional_parameter_1)(/:optional_parameter_2)', action);

      expect(action).toHaveBeenCalledWith('foo', null);
    });

    it('does not match missing optional parameters', () => {
      router.location = new Location('https://example.com/foo');
      router.route('(/bar)/foo(/biz)', action);

      expect(action).toHaveBeenCalled();
    });
  });

  describe('regular expression matching', () => {
    it('matches a single group', () => {
      router.location = new Location('https://example.com/foo/bar');
      router.route(new RegExp('^/(.*?)/.*$'), action);

      expect(action).toHaveBeenCalledWith('foo');
    });

    it('matches multiple groups', () => {
      router.location = new Location('https://example.com/foo/bar');
      router.route(new RegExp('^/(.*?)/(.*?)$'), action);

      expect(action).toHaveBeenCalledWith('foo', 'bar')
    });

    it('does not match passive groups', () => {
      router.location = new Location('https://example.com/foo/bar/biz');
      router.route(new RegExp('^/(.*?)/(?:.*?)/(.*?)$'), action);

      expect(action).toHaveBeenCalledWith('foo', 'biz');
    });
  });
});
