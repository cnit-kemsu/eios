const rollup = require('rollup')
const path = require('path')

const { dev } = require('minimist')(process.argv.slice(2))

const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

const pkg = require('../package.json')

rollup.rollup({
    input: 'server/index.js',
    external(id) {
        return !id.startsWith('.') && !id.startsWith(path.resolve(__dirname, '../server'))
    },
    plugins: [
        babel({
            exclude: 'node_modules/**',
            ...pkg.babelOptions
        }),
        resolve(),
        commonjs({  }),
        !dev && require('rollup-plugin-terser').terser()
    ]
}).then(bundle => {
    bundle.write({
        file: 'dist/server/index.js',
        format: 'cjs'        
    })
})