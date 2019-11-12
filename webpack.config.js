const path = require('path')
const fs = require('fs')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const pkg = JSON.parse(fs.readFileSync(__dirname + '/package.json'))

module.exports = (env, argv) => ({
    entry: [
        'react-hot-loader/patch',
        '@babel/polyfill',
        './src/index.js'
    ],
    output: {
        filename: 'index.js',
        chunkFilename: '[name].js',
        publicPath: '/',
        path: argv.deploy && process.env.EIOS_DEPLOYMENT_PATH ? process.env.EIOS_DEPLOYMENT_PATH : path.resolve(__dirname, 'dist'),
    },
    optimization: {
        splitChunks: {
            maxSize: 244 * 1024
        }
    },
    performance: {
        hints: false
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
    devServer: {
        contentBase: __dirname + '/dist',
        historyApiFallback: true,
        host: '0.0.0.0',
        hot: true,
        disableHostCheck: true
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new CopyPlugin([
            { from: 'src/assets', to: 'assets' },            
          ])
    ],
    resolve: {
        symlinks: true,
        alias: {
            'share': path.resolve(__dirname, 'src/share'),
            'react-dom': '@hot-loader/react-dom'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: pkg.babelOptions
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader',
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader',
                ],
            }
        ]
    }
})