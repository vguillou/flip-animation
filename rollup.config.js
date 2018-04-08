import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import pkg from './package.json';

const PROD = process.env.NODE_ENV === 'production';
const INPUT = 'src/index.js';

// browser-friendly UMD build
const configUmd = {
  input: INPUT,
  output: {
    name: 'flip',
    file: PROD ? pkg.mainMin : pkg.main,
    format: 'umd',
    sourcemap: !PROD,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    PROD && uglify(),
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
