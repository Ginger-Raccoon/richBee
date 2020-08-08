const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const WebpackMd5Hash = require('webpack-md5-hash');


module.exports = {
    entry: {
        main: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        plugins: ['transform-class-properties']
                    }
                }
            },
            {
                test: /\.scss$/,
                use:[
                    'style-loader',
                    'css-loader',
                    'sass-loader']
            },
            {
                test: /\.(png|jpg|gif|ico|svg)$/,
                use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: './src/images/[name].[ext]', 
                                esModule: false
                            }
                        }
                ]
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'file-loader?name=./vendor/[name].[ext]'
            },
            // {
            //     test: /\.css$/i,
            //     use: [
            //             (isDev ? 'style-loader' : MiniCssExtractPlugin.loader),
            //                 {
            //                     loader: 'css-loader',
            //                     options: {
            //                         importLoaders: 2
            //                     }  
            //                 },
            //                 'postcss-loader'
            //         ]
            // },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.[contenthash].scss',
        }),
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new HtmlWebpackPlugin({
            // Означает, что:
            inject: false, // стили НЕ нужно прописывать внутри тегов
            template: './src/index.html', // откуда брать образец для сравнения с текущим видом проекта
            filename: 'index.html' // имя выходного файла, то есть того, что окажется в папке dist после сборки
        }),
        new OptimizeCssAssetsPlugin({ // подключите плагин после MiniCssExtractPlugi
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                    preset: ['default'],
            },
            canPrint: true,
        }),
        new WebpackMd5Hash() 
    ]
};
