import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import rollupTS from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import size from 'rollup-plugin-filesize'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/index.tsx',
  output: [
    {
      format: 'es',
      exports: 'named',
      dir: 'dist/',
      sourcemap: true,
      name: 'ReactSpringDialog',
    },
  ],
  plugins: [
    rollupTS({
      tsconfigOverride: {
        exclude: ['Examples', 'node_modules'],
      },
    }),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react'],
    }),
    commonjs(),
    external(),
    resolve(),
    terser(),
    size(),
  ],
}
