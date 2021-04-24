import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import rollupTS from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import size from 'rollup-plugin-filesize'

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react/jsx-runtime': 'jsxRuntime',
}

export default {
  input: 'src/index.tsx',
  output: [
    {
      format: 'umd',
      exports: 'named',
      dir: 'dist/',
      sourcemap: true,
      name: 'ReactSpringDialog',
      globals,
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
    external(),
    resolve(),
    terser(),
    size(),
  ],
}
