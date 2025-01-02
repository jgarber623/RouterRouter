import { mock, test } from "node:test";
import assert from "node:assert";

import { JSDOM } from "jsdom";

import RouterRouter from "./index.js";

/**
 * @param {string} url A URL string of the page under test.
 * @returns {object} An object containing the action spy, the JSDOM instance,
 *     and the RouterRouter instance.
 */
function setup(url = "https://routerrouter.example") {
  const dom = new JSDOM("", { url });

  Object.assign(globalThis, { window: dom.window });

  const action = mock.fn();
  const router = new RouterRouter();

  return { action, dom, router };
}

test("matches a forward slash", () => {
  const { action, router } = setup();

  router.route("/", action);

  assert.strictEqual(action.mock.callCount(), 1);
});

test("matches a string", () => {
  const { action, router } = setup("https://example.com/foo");

  router.route("/foo", action);

  assert.strictEqual(action.mock.callCount(), 1);
});

test("treats trailing slashes as unique URLs", () => {
  const { action, router } = setup("https://example.com/foo/");

  router.route("/foo", action);

  assert.strictEqual(action.mock.callCount(), 0);
});

test("matches a string containing special characters", () => {
  const { action, router } = setup("https://example.com/$foo/~bar/@=|biz!buz.html");

  router.route("/$foo/~bar/@=|biz!buz.html", action);

  assert.strictEqual(action.mock.callCount(), 1);
});

test("matches a string containing encoded characters", () => {
  const { action, router } = setup("https://example.com/foo%2Fbar");

  router.route("/foo/bar", action);

  assert.strictEqual(action.mock.callCount(), 1);
});

test("matches a string containing Unicode characters", () => {
  const { action, router } = setup("https://example.com/föö");

  router.route("/föö", action);

  assert.strictEqual(action.mock.callCount(), 1);
});

test("matches a string containing emoji characters", () => {
  const { action, router } = setup("https://example.com/🤔");

  router.route("/🤔", action);

  assert.strictEqual(action.mock.callCount(), 1);
});

test("matches a string containing newline characters", () => {
  const { action, router } = setup("https://example.com/foo%0Abar");

  router.route("/foo\nbar", action);

  assert.strictEqual(action.mock.callCount(), 1);
});

test("matches a single named parameter", () => {
  const { action, router } = setup("https://example.com/posts/1");

  router.route("/posts/:id", action);

  assert.strictEqual(action.mock.callCount(), 1);
  assert.deepStrictEqual(action.mock.calls[0].arguments, ["1"]);
});

test("matches multiple named parameters", () => {
  const { action, router } = setup("https://example.com/posts/1");

  router.route("/:section/:id", action);

  assert.strictEqual(action.mock.callCount(), 1);
  assert.deepStrictEqual(action.mock.calls[0].arguments, ["posts", "1"]);
});

test("matches a complex named parameter", () => {
  const { action, router } = setup("https://example.com/posts/a-sample-post-name");

  router.route("/posts/a-:named_parameter-post-name", action);

  assert.strictEqual(action.mock.callCount(), 1);
  assert.deepStrictEqual(action.mock.calls[0].arguments, ["sample"]);
});

test("does not match a named parameter containing invalid characters", () => {
  const { action, router } = setup("https://example.com/posts/1");

  router.route("/posts/:🤔", action);

  assert.strictEqual(action.mock.callCount(), 0);
});

test("matches a single wildcard parameter", () => {
  const { action, router } = setup("https://example.com/foo/bar/biz/baz");

  router.route("/*wildcard_parameter/baz", action);

  assert.strictEqual(action.mock.callCount(), 1);
  assert.deepStrictEqual(action.mock.calls[0].arguments, ["foo/bar/biz"]);
});

test("matches multiple wildcard parameters", () => {
  const { action, router } = setup("https://example.com/foo/bar/biz/baz");

  router.route("/foo/*/biz/*", action);

  assert.strictEqual(action.mock.callCount(), 1);
  assert.deepStrictEqual(action.mock.calls[0].arguments, ["bar", "baz"]);
});

test("matches a single optional parameter", () => {
  const { action, router } = setup("https://example.com/foo");

  router.route("/foo(/)", action);

  assert.strictEqual(action.mock.callCount(), 1);
});

test("matches multiple optional parameters", () => {
  const { action, router } = setup("https://example.com/foo/bar/biz");

  router.route("/foo(/bar)(/biz)", action);

  assert.strictEqual(action.mock.callCount(), 1);
});

test("matches a single optional named parameter", () => {
  const { action, router } = setup("https://example.com/foo/bar");

  router.route("/foo(/:optional_parameter)", action);

  assert.strictEqual(action.mock.callCount(), 1);
  assert.deepStrictEqual(action.mock.calls[0].arguments, ["bar"]);
});

test("matches multiple optional named parameters", () => {
  const { action, router } = setup("https://example.com/foo");

  router.route("(/:optional_parameter_1)(/:optional_parameter_2)", action);

  assert.strictEqual(action.mock.callCount(), 1);
  assert.deepStrictEqual(action.mock.calls[0].arguments, ["foo", null]);
});

test("does not match missing optional parameters", () => {
  const { action, router } = setup("https://example.com/foo");

  router.route("(/bar)/foo(/biz)", action);

  assert.strictEqual(action.mock.callCount(), 1);
});

test("matches a single group", () => {
  const { action, router } = setup("https://example.com/foo/bar");

  router.route(/^\/(.*)\/.*$/, action);

  assert.strictEqual(action.mock.callCount(), 1);
  assert.deepStrictEqual(action.mock.calls[0].arguments, ["foo"]);
});

test("matches multiple groups", () => {
  const { action, router } = setup("https://example.com/foo/bar");

  router.route(/^\/(.*)\/(.*)$/, action);

  assert.strictEqual(action.mock.callCount(), 1);
  assert.deepStrictEqual(action.mock.calls[0].arguments, ["foo", "bar"]);
});

test("does not match passive groups", () => {
  const { action, router } = setup("https://example.com/foo/bar/biz");

  router.route(/^\/(.*)\/.*\/(.*)$/, action);

  assert.strictEqual(action.mock.callCount(), 1);
  assert.deepStrictEqual(action.mock.calls[0].arguments, ["foo", "biz"]);
});
