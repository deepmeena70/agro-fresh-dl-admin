const commonPath = require('./common-paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    entry: {
        app: `${commonPath.appEntry}/index.js`
    },
    output: {
        filename: 'static/[name].[chunkhash].js',
        path: commonPath.outputPath,
        clean: true,
        publicPath: '/',
        assetModuleFilename: 'images/[contenthash][ext][query]'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            favicon: 'public/favicon.ico',
            title: 'Webpack | React'
        }),
    ],
    module: {

        rules: [
            {
                test:/\.js$|jsx/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|mp4)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[contenthash][ext][query]'
                }

            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[contenthash][ext][query]'
                }
            },
            {
                test: /\.typeface.json$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[contenthash][ext][query]'
                }
            },
        ],
    },

    optimization: {
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
};

module.exports = config;

