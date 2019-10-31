import copy from 'rollup-plugin-copy'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import alias from 'rollup-plugin-alias'
import glob from 'glob'
import path from 'path'
import replace from 'rollup-plugin-replace'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'

import rimraf from 'rimraf'

import * as pkg from './package.json'


const namedExports = {
    'react': Object.getOwnPropertyNames(require('react')),
    'react-dom': Object.getOwnPropertyNames(require('react-dom'))
}


function getInputForApps() {

    const input = {}

    for (const inp of pkg.rollup.inputs) {

        const dlNameList = glob.sync(inp, { cwd: __dirname + '/src' })

        for (const name of dlNameList) {
            input[name.slice(0, -3)] = `src/${name}`
        }
    }

    return input
}

const production = process.env.BUILD === 'production'


rimraf.sync(path.join(__dirname, 'dist'))


export default {

    input: {
        index: 'src/index.js',
        ...getInputForApps()
    },

    manualChunks(id) {

        if (id.startsWith(__dirname)) {
            id = id.slice(__dirname.length + 1)
        }

        if (id.startsWith('\u0000' + __dirname)) {
            id = id.slice(__dirname.length + 2)
        }

        // TODO: после установки @kemsu/* пакетов, убрать id.includes('@kemsu')
        if (id.startsWith('node_modules') || id.includes('@kemsu')) {
            return 'vendor'
        }

        // На Windows будет обратный слэш. Заменим для удобства
        id = id.replace(/\\/g, '/')

        if (id.startsWith('src/share')) {
            return 'share'
        }

        if (id.startsWith('src/apps')) {
            return `apps/${id.split('/')[2]}/index`
        }

        if (id.startsWith('src')) return 'index'

        return id
    },

    output: {
        chunkFileNames: '[name].js',
        dir: 'dist',
        format: 'system',
        sourcemap: true,
        exports: 'named'
    },

    plugins: [        
        copy({
            targets: [
                { src: 'src/index.html', dest: 'dist' },
                { src: 'node_modules/systemjs/dist/system.min.js', dest: 'dist' },
                { src: 'node_modules/@babel/polyfill/dist/polyfill.min.js', dest: "dist" },
                { src: 'node_modules/systemjs/dist/extras/named-register.min.js', dest: 'dist' }
            ],
            copyOnce: true
        }),
        babel({
            exclude: 'node_modules/**',
            ...pkg.babelOptions
        }),
        resolve({
            dedupe: Object.keys(pkg.dependencies)
        }),
        commonjs({ namedExports }),
        alias({
            entries: [
                { find: "share", replacement: path.resolve(__dirname, 'src/share') }
            ]
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development')
        }),
        postcss({ modules: true }),
        production && terser()
    ],
    watch: {
        chokidar: true,
        includes: ['src/**']
    }
}