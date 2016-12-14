var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/index.html',
    filename: 'index.html',
    inject: 'body'
});
var uglify = new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    }
});
module.exports = {
    entry: ['./js/main.js'],
    output: {
        filename: "main_bundle.js",
        path: __dirname + '/dist'
    },
    devtool: "sourcemap",
    module: {
        loaders: [
            {
                test: /\.less$/,
                loader: "style!css!less"
            }
        ]
    },
    plugins: [
        HTMLWebpackPluginConfig,
        uglify
    ]
}