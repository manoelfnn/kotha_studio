const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');



const PATHS = {
    src: path.join(__dirname, 'src'),
    dist: path.join(__dirname, 'dist')
}

module.exports = {
    mode: 'development',
    entry: {
        main: PATHS.src + '/js'
    },
    plugins: [
     //   new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ template: PATHS.src + '/index.html' }),
        new CopyPlugin({
            patterns: [
                { from: 'src/assets', to: 'assets/' },
                'src/manifest.json',
                'src/sw.js',
                'src/.htaccess'
            ],
        }),
    ],    
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    output: {
        path: PATHS.dist,
        filename: '[name].js'
    },
};
