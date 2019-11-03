const path = require('path')
const fs = require('fs')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: argv.mode === 'production' ? 'none' : 'source-map',
    devServer: {
        contentBase: __dirname + '/dist',
        historyApiFallback: true
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ],
    resolve: {     
        symlinks: false,  
        alias: {
            //'@kemsu/react-routing': path.resolve(__dirname, '../../@kemsu/react-routing'),
            //'@kemsu/eios-ui': path.resolve(__dirname, 'src/modules/eios-ui/index.js'),
            'share': path.resolve(__dirname, 'src/share')
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
        ],
    },
})