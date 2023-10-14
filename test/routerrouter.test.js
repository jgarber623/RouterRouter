import sinon from 'sinon';
import test from 'ava';
import { JSDOM } from 'jsdom';

import RouterRouter from '../src/routerrouter.js';

/**
 * @param {string} url A URL string of the page under test.
 *
 * @returns {object} An object containing the action spy, the JSDOM instance,
 *     and the RouterRouter instance.
 */
function setup(url = 'https://routerrouter.example') {
  const dom = new JSDOM('', { url });

  Object.assign(globalThis, { window: dom.window });

  const action = sinon.spy();
  const router = new RouterRouter();

  return { action, dom, router };
}

test('matches a forward slash', t => {
  const { action, router } = setup();

  router.route('/', action);

  t.true(action.calledOnce);
});

test('matches a string', t => {
  const { action, router } = setup('https://example.com/foo');

  router.route('/foo', action);

  t.true(action.calledOnce);
});

test('treats trailing slashes as unique URLs', t => {
  const { action, router } = setup('https://example.com/foo/');

  router.route('/foo', action);

  t.true(action.notCalled);
});

test('matches a string containing special characters', t => {
  const { action, router } = setup('https://example.com/$foo/~bar/@=|biz!buz.html');

  router.route('/$foo/~bar/@=|biz!buz.html', action);

  t.true(action.calledOnce);
});

test('matches a string containing encoded characters', t => {
  const { action, router } = setup('https://example.com/foo%2Fbar');

  router.route('/foo/bar', action);

  t.true(action.calledOnce);
});

test('matches a string containing Unicode characters', t => {
  const { action, router } = setup('https://example.com/föö');

  router.route('/föö', action);

  t.true(action.calledOnce);
});

test('matches a string containing emoji characters', t => {
  const { action, router } = setup('https://example.com/🤔');

  router.route('/🤔', action);

  t.true(action.calledOnce);
});

test('matches a string containing newline characters', t => {
  const { action, router } = setup('https://example.com/foo%0Abar');

  router.route('/foo\nbar', action);

  t.true(action.calledOnce);
});

test('matches a single named parameter', t => {
  const { action, router } = setup('https://example.com/posts/1');

  router.route('/posts/:id', action);

  t.true(action.calledOnceWith('1'));
});

test('matches multiple named parameters', t => {
  const { action, router } = setup('https://example.com/posts/1');

  router.route('/:section/:id', action);

  t.true(action.calledOnceWith('posts', '1'));
});

test('matches a complex named parameter', t => {
  const { action, router } = setup('https://example.com/posts/a-sample-post-name');

  router.route('/posts/a-:named_parameter-post-name', action);

  t.true(action.calledOnceWith('sample'));
});

test('does not match a named parameter containing invalid characters', t => {
  const { action, router } = setup('https://example.com/posts/1');

  router.route('/posts/:🤔', action);

  t.true(action.notCalled);
});

test('matches a single wildcard parameter', t => {
  const { action, router } = setup('https://example.com/foo/bar/biz/baz');

  router.route('/*wildcard_parameter/baz', action);

  t.true(action.calledOnceWith('foo/bar/biz'));
});

test('matches multiple wildcard parameters', t => {
  const { action, router } = setup('https://example.com/foo/bar/biz/baz');

  router.route('/foo/*/biz/*', action);

  t.true(action.calledOnceWith('bar', 'baz'));
});

test('matches a single optional parameter', t => {
  const { action, router } = setup('https://example.com/foo');

  router.route('/foo(/)', action);

  t.true(action.calledOnce);
});

test('matches multiple optional parameters', t => {
  const { action, router } = setup('https://example.com/foo/bar/biz');

  router.route('/foo(/bar)(/biz)', action);

  t.true(action.calledOnce);
});

test('matches a single optional named parameter', t => {
  const { action, router } = setup('https://example.com/foo/bar');

  router.route('/foo(/:optional_parameter)', action);

  t.true(action.calledOnceWith('bar'));
});

test('matches multiple optional named parameters', t => {
  const { action, router } = setup('https://example.com/foo');

  router.route('(/:optional_parameter_1)(/:optional_parameter_2)', action);

  t.true(action.calledOnceWith('foo', null));
});

test('does not match missing optional parameters', t => {
  const { action, router } = setup('https://example.com/foo');

  router.route('(/bar)/foo(/biz)', action);

  t.true(action.calledOnce);
});

test('matches a single group', t => {
  const { action, router } = setup('https://example.com/foo/bar');

  router.route(/^\/(.*)\/.*$/, action);

  t.true(action.calledOnceWith('foo'));
});

test('matches multiple groups', t => {
  const { action, router } = setup('https://example.com/foo/bar');

  router.route(/^\/(.*)\/(.*)$/, action);

  t.true(action.calledOnceWith('foo', 'bar'));
});

test('does not match passive groups', t => {
  const { action, router } = setup('https://example.com/foo/bar/biz');

  router.route(/^\/(.*)\/.*\/(.*)$/, action);

  t.true(action.calledOnceWith('foo', 'biz'));
});
