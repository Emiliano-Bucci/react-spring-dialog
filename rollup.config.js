import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import rollupTS from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import size from 'rollup-plugin-filesize'
import commonjs from '@rollup/plugin-commonjs'
import pkg from './package.json'

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react/jsx-runtime': 'jsxRuntime',
  'react-spring': 'reactSpring',
  'focus-trap-react': 'FocusTrap',
}

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      exports: 'named',
      sourcemap: true,
      name: 'ReactSpringDialog',
      globals,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
      name: 'ReactSpringDialog',
      globals,
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    rollupTS({
      tsconfigOverride: {
        exclude: ['src/Examples', 'src/test', 'node_modules'],
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
