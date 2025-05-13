import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  // Point to your JS entry file
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',  // or another format based on your requirements
    sourcemap: true
  },
  plugins: [
    resolve(),
    commonjs()
  ]
};