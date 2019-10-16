const { dev = true, watch = false } = require('minimist')(process.argv.slice(2))
const rollup = require('rollup')
const fs = require('fs')
const path = require('path')
var rimraf = require("rimraf")

const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const alias = require('rollup-plugin-alias')
const replace = require('rollup-plugin-replace')
const postcss = require('rollup-plugin-postcss')
const { terser } = require('rollup-plugin-terser')

const readline = require('readline')

const glob = require('glob')

/**
 * Named exports for some CommonJS modules
 */
const namedExports = {
    'react': Object.getOwnPropertyNames(require('react')),
    'react-dom': Object.getOwnPropertyNames(require('react-dom'))
}


/**
 * Сonverts input array to object format
 */
function mapSrcInputArrayToObject(inputArray, inputObject = {}) {

    const globOptions = { cwd: __dirname + '/../src' }

    for (let inputArrayItem of inputArray) {

        if (!inputArrayItem.endsWith('.js')) throw new Error(`Invalid input '${inputArrayItem}'! The input must end with '.js'`)

        // If input is glob pattern
        if (inputArrayItem.includes('*')) {
            mapSrcInputArrayToObject(glob.sync(inputArrayItem, globOptions), inputObject)
        } else {
            inputObject[inputArrayItem.slice(0, -3)] = 'src/' + inputArrayItem
        }

    }

    return inputObject
}

function mapExtInputArrayToObject(inputArray) {

    let inputObject = {}

    for (let inputArrayItem of inputArray) {
        inputObject[inputArrayItem] = require.resolve(inputArrayItem)
    }

    return inputObject
}

/**
 * Build
 */
(async function build() {

    const pkg = JSON.parse(fs.readFileSync(__dirname + '/../package.json'))

    /**
     *  External modules equal `dependencies` minus `serverDependencies` (from package.json)
     */
    const external = Object.keys(pkg.dependencies).filter(dep => !~pkg.serverDependencies.indexOf(dep))

    // Source modules config
    const srcConfig = {
        input: mapSrcInputArrayToObject(pkg.rollup.inputs),
        output: {
            dir: 'dist/public',
            format: 'system',
            sourcemap: true
        },
        external(id, parentId) {

            const inExternal = ~external.indexOf(id)

            // Check module package.json (if it exists)
            if (inExternal) {
                const moduleFolder = path.dirname(parentId)
                try {
                    const { dependencies } = JSON.parse(fs.readFileSync(moduleFolder + '/package.json'))

                    if (~Object.keys(dependencies).indexOf(id)) return false

                } catch{ }
            }

            return inExternal
        },
        plugins: [
            babel({
                exclude: 'node_modules/**',
                ...pkg.babelOptions
            }),
            postcss({ modules: true }),
            replace({
                'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production')
            }),
            resolve(),
            alias({

                "@kemsu/eios-ui": path.resolve(__dirname, '../../../@kemsu/eios-ui/src/index.js'),
                "@kemsu/react-routing": path.resolve(__dirname, '../../../@kemsu/react-routing/src/index.js')

            }),
            commonjs({ namedExports }),
            !dev && terser()
        ],
        watch: {
            chokidar: true
        },
    }

    // External modules config
    const extConfig = {
        input: external,
        output: {
            dir: 'dist/public/common-modules',
            chunkFileNames: '[name].js',
            format: 'system',
            sourcemap: false,
            exports: 'named'
        },
        external,
        plugins: [
            replace({
                'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production')
            }),
            resolve(),
            commonjs({ namedExports }),
            !dev && terser()
        ]
    };

    const cwd = __dirname + '/../'

    // Clean dist folder

    console.log("\x1b[32m", 'clean dist folder', "\x1b[0m")

    rimraf.sync(cwd + 'dist')

    // Copy static files  

    console.log("\x1b[32m", 'copy static files', "\x1b[0m")

    // Recursive create vendors folder
    fs.mkdirSync(cwd + 'dist/public/vendors', { recursive: true })

    const staticFiles = [
        ['src/index.html', 'dist/public/index.html'],
        [`node_modules/@babel/polyfill/dist/polyfill${!dev ? '.min' : ''}.js`, "dist/public/vendors/polyfill.js"],
        [`node_modules/systemjs/dist/system${!dev ? '.min' : ''}.js`, 'dist/public/vendors/system.js'],
        [`node_modules/systemjs/dist/extras/named-register${!dev ? '.min' : ''}.js`, 'dist/public/vendors/system.named-register.js']
    ].concat(pkg.rollup.staticFiles)

    staticFiles.forEach(([src, dst]) => fs.copyFileSync(cwd + src, cwd + dst))

    // Bundle common modules
    console.log("\x1b[32m", 'bundle common modules', "\x1b[0m")

    const extBundle = await rollup.rollup(extConfig)
    const { output } = await extBundle.generate(extConfig.output)

    let bundleCode = ''

    // Add module name to `System.register` function and replace `./chunk.js` with `chunk`
    for (let chunk of output) {

        const chunkName = chunk.facadeModuleId ?
            /node_modules[/\\]((?:@[^/\\]+[/\\])?[^/\\]+)/.exec(chunk.facadeModuleId)[1].replace('\\', '/')
            :
            chunk.fileName.slice(0, -3)

        const code = chunk.code
            .replace(/^System\.register\(/, `System.register('${chunkName}',`)
            .replace(/(\.\.?\/)*chunk(\d*)\.js/g, 'chunk$2')

        bundleCode = bundleCode.concat(code)
    }

    bundleCode = bundleCode.replace(/('|")\.\/([^'".]+)\.js('|")/g, '"$2"')

    fs.writeFileSync(cwd + 'dist/public/vendors/common-modules.js', bundleCode)

    // Bundle source modules
    if (watch) {

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        const srcWatcher = rollup.watch(srcConfig)

        const question = () => rl.question("\x1b[33mEnter 'r' to restart:\x1b[0m ", value => {
            if (value === 'r') {
                srcWatcher.close()
                console.log('Full restart build')
                build()
            } else if (value === 'e') {
                srcWatcher.close()
                rl.close()
            } else {
                question()
            }
        })

        srcWatcher.on('event', ({ code, error }) => {
            switch (code) {
                case 'START': console.log('the watcher is (re)starting'); break
                case 'BUNDLE_START': console.log("\x1b[32m", 'bundle source modules', "\x1b[0m"); break
                case 'BUNDLE_END': console.log("\x1b[32m", 'finished bundle source modules', "\x1b[0m"); break
                case 'END': question(); break
                case 'ERROR':
                case 'FATAL': console.error(error.stack); break
            }
        })
    } else {
        console.log("\x1b[32m", 'bundle source modules', "\x1b[0m")

        const srcBundle = await rollup.rollup(srcConfig)
        await srcBundle.write(srcConfig.output)

        console.log("\x1b[32m", 'finished bundle source modules', "\x1b[0m")
    }

})()