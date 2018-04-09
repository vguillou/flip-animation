import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import serve from 'rollup-plugin-serve';
import pkg from './package.json';

const PROD = process.env.NODE_ENV === 'production';
const DEV = process.env.NODE_ENV === 'development';
const INPUT = 'src/index.js';

// browser-friendly UMD build
const configUmd = {
  input: INPUT,
  output: {
    name: 'Flip',
    file: PROD ? pkg.mainMin : pkg.main,
    format: 'umd',
    sourcemap: !PROD,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    PROD && uglify(),
    DEV &&
      serve({
        open: true,
        contentBase: ['examples', 'dist'],
        port: 10002,
      }),
  ],
};

// ES6 module
const configEsm = {
  input: INPUT,
  output: {
    file: PROD ? pkg.moduleMin : pkg.module,
    format: 'es',
    sourcemap: !PROD,
  },
  plugins: [PROD && uglify()],
};

export default [configUmd, configEsm];
