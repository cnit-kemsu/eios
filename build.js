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


// Именнованный экспорт для некоторых CommonJs модулей 
const namedExports = {
    'react': Object.getOwnPropertyNames(require('react')),
    'react-dom': Object.getOwnPropertyNames(require('react-dom'))
}


// Преобразование входного массива модулей в формат объекта 
function mapSrcInputArrayToObject(inputArray, inputObject = {}) {

    const globOptions = { cwd: __dirname + '/src' }

    for (let inputArrayItem of inputArray) {

        if (!inputArrayItem.endsWith('.js')) throw new Error(`Invalid input '${inputArrayItem}'! The input must end with '.js'`)

        // Если используется шаблон для глобального поиска
        if (inputArrayItem.includes('*')) {
            mapSrcInputArrayToObject(glob.sync(inputArrayItem, globOptions), inputObject)
        } else {
            inputObject[inputArrayItem.slice(0, -3)] = 'src/' + inputArrayItem
        }

    }

    return inputObject
}


// Сборка
(async function build() {

    const pkg = JSON.parse(fs.readFileSync(__dirname + '/package.json'))

    // Общие модули берутся из списка зависимостей (поле "dependencies" в файле package.json)
    const external = Object.keys(pkg.dependencies)

    // Конфигурация для исходников
    const srcConfig = {
        input: mapSrcInputArrayToObject(pkg.rollup.inputs),
        output: {
            dir: 'dist/public',
            format: 'system',
            sourcemap: true
        },
        external(id, parentId) {

            const inExternal = ~external.indexOf(id)

            // Проверка package.json модуля (если он существует)
            if (inExternal) {
                const moduleFolder = path.dirname(parentId)
                try {
                    const { dependencies } = JSON.parse(fs.readFileSync(moduleFolder + '/package.json'))

                    if (~Object.keys(dependencies).indexOf(id)) return false

                    // eslint-disable-next-line no-empty
                } catch { }
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
                entries: [
                    { find: "@kemsu/eios-ui", replacement: path.resolve(__dirname, '../../@kemsu/eios-ui/src/index.js') },
                    { find: "@kemsu/react-routing", replacement: path.resolve(__dirname, '../../@kemsu/react-routing/src/index.js') },
                    { find: "eios", replacement: path.resolve(__dirname, 'src') }
                ]
            }),
            commonjs({ namedExports }),
            !dev && terser()
        ],
        watch: {
            chokidar: true
        },
    }

    // Конфигурация для общих модулей
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

    const cwd = __dirname + '/'

    // Очистка целевой папки
    console.log("\x1b[32m", 'Очистка папки dist', "\x1b[0m")

    rimraf.sync(cwd + 'dist')

    console.log("\x1b[32m", 'Копирование статических файлов', "\x1b[0m")

    // Создание папки для сторонних библиотек
    fs.mkdirSync(cwd + 'dist/public/vendors', { recursive: true })

    const staticFiles = [
        ['src/index.html', 'dist/public/index.html'],
        [`node_modules/@babel/polyfill/dist/polyfill${!dev ? '.min' : ''}.js`, "dist/public/vendors/polyfill.js"],
        [`node_modules/systemjs/dist/system${!dev ? '.min' : ''}.js`, 'dist/public/vendors/system.js'],
        [`node_modules/systemjs/dist/extras/named-register${!dev ? '.min' : ''}.js`, 'dist/public/vendors/system.named-register.js']
    ].concat(pkg.rollup.staticFiles)

    // Копирование статических файлов
    staticFiles.forEach(([src, dst]) => fs.copyFileSync(cwd + src, cwd + dst))

    // Сборка общих модулей (таких как react)
    console.log("\x1b[32m", 'Сборка общих модулей', "\x1b[0m")

    const extBundle = await rollup.rollup(extConfig)
    const { output } = await extBundle.generate(extConfig.output)

    let bundleCode = ''

    // Добавление имени модуля в `System.register`
    for (let chunk of output) {

        const chunkName = chunk.facadeModuleId ?
            /node_modules[/\\]((?:@[^/\\]+[/\\])?[^/\\]+)/.exec(chunk.facadeModuleId)[1].replace('\\', '/')
            :
            chunk.fileName.slice(0, -3)

        const code = chunk.code
            .replace(/^System\.register\(/, `System.register('${chunkName}',`)
        bundleCode = bundleCode.concat(code)
    }

    // Обработка зависимостей, таких как ./checkPropTypes.js из модуля prop-types. 
    bundleCode = bundleCode.replace(/('|")\.\/([^'".]+)\.js('|")/g, '"$2"')

    fs.writeFileSync(cwd + 'dist/public/vendors/common-modules.js', bundleCode)

    // Сборка исходников в режиме наблюдения за изменениями и пересборкой    
    if (watch) {

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        const srcWatcher = rollup.watch(srcConfig)

        const question = () => rl.question("\x1b[33mВведите 'r' для перезапуска:\x1b[0m ", value => {
            if (value === 'r') {
                srcWatcher.close()
                console.log('Перезапуск сборки')
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
                case 'START': console.log('Остлеживание изменений в исходниках запущено'); break
                case 'BUNDLE_START': console.log("\x1b[32m", 'Сборка исходников', "\x1b[0m"); break
                case 'BUNDLE_END': console.log("\x1b[32m", 'Сборка исходников завершена', "\x1b[0m"); break
                case 'END': question(); break
                case 'ERROR':
                case 'FATAL': console.error(error.stack); break
            }
        })
        // Сборка исходников
    } else {
        console.log("\x1b[32m", 'Сборка исходников', "\x1b[0m")

        const srcBundle = await rollup.rollup(srcConfig)
        await srcBundle.write(srcConfig.output)

        console.log("\x1b[32m", 'Сборка исходнико завершена', "\x1b[0m")
    }

})()