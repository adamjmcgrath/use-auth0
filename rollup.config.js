import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import del from 'rollup-plugin-delete';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: './src/index.js',
  output: {
    file: './dist/index.js',
    format: 'cjs'
  },
  plugins: [
    del({ targets: 'dist/*' }),
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs(),
    process.env.NODE_ENV === 'production' && terser()
  ],
  external: id => /^react/.test(id)
};
