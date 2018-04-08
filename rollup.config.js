import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import serve from 'rollup-plugin-serve';

const { FORMAT } = process.env;
const UGLY = process.env.UGLY === 'true';
const SERVE = process.env.SERVE === 'true';

const outputFileExtension = UGLY ? '.min' : '';

const config = {
  input: {
    file: 'src/flip.js',
  },
  output: {
    file: `dist/flip.${FORMAT}${outputFileExtension}.js`,
    format: FORMAT,
    sourcemap: !UGLY,
  },
  plugins: [resolve()],
};

if (FORMAT !== 'es') {
  console.log('Transpiling on');
  config.plugins.push(babel({ exclude: 'node_modules/**' })); // only transpile our source code
}

if (UGLY) {
  config.plugins.push(uglify());
}

if (SERVE) {
  config.plugins.concat([
    serve({
      open: true,
      contentBase: ['examples', 'dist'],
      host: 'localhost',
      port: 10002,
    }),
  ]);
}

export default config;
