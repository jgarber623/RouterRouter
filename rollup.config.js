import pkg from './package.json';

import filesize from 'rollup-plugin-filesize';
import uglify from 'rollup-plugin-uglify';

const packageName = 'RouterRouter';
const releaseYear = 2013;
const srcFilePath = 'src/routerrouter.js';

const filesizePluginOptions = {
  format: {
    exponent: 0,
    fullform: true
  },
  theme: 'light'
};

const preamble = `/*!
 *  ${packageName} v${pkg.version}
 *
 *  ${pkg.description}
 *
 *  Source code available at: ${pkg.homepage}
 *
 *  (c) ${releaseYear}-present ${pkg.author.name} (${pkg.author.url})
 *
 *  ${packageName} may be freely distributed under the ${pkg.license} license.
 */
`;

export default [
  // routerrouter.es.js and routerrouter.js
  {
    input: srcFilePath,
    output: [
      {
        file: pkg.module,
        format: 'es'
      },
      {
        file: pkg.main,
        format: 'umd',
        name: packageName
      }
    ],
    plugins: [
      filesize(filesizePluginOptions),
      uglify({
        compress: false,
        mangle: false,
        output: {
          beautify: true,
          indent_level: 2,
          preamble: preamble
        }
      })
    ]
  },

  // routerrouter.min.js
  {
    input: srcFilePath,
    output: {
      file: pkg.main.replace(/\.js$/, '.min.js'),
      format: 'umd',
      name: packageName
    },
    plugins: [
      filesize(filesizePluginOptions),
      uglify({
        output: {
          preamble: preamble
        }
      })
    ]
  }
];
