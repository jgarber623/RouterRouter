import { readFileSync } from "node:fs";

import terser from "@rollup/plugin-terser";

const pkg = JSON.parse(readFileSync("./package.json"));

const input = "./src/routerrouter.js";
const name = "RouterRouter";

const banner = `/**
 * @name ${name}
 * @version ${pkg.version}
 *
 * @file ${pkg.description}
 *
 * {@link ${pkg.homepage}}
 *
 * @copyright 2013 ${pkg.author.name} (${pkg.author.url})
 *
 * @license ${pkg.license}
 */
`;

const terserConfig = {
  compress: false,
  mangle: false,
  output: {
    beautify: true,
    indent_level: 2,
  },
};

export default [
  {
    input,
    output: {
      banner,
      file: pkg.exports.import,
      format: "es",
    },
    plugins: [terser(terserConfig)],
  },
  {
    input,
    output: {
      banner,
      file: pkg.exports.require,
      format: "cjs",
    },
    plugins: [terser(terserConfig)],
  },
  {
    input,
    output: {
      banner,
      file: pkg.browser,
      format: "iife",
      name,
    },
    plugins: [terser()],
  },
];
