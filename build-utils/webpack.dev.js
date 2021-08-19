const port = process.env.PORT || 3000;

const config = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        port: port,
        hot: true,
        historyApiFallback: true
    },
    module:{
        rules:[
            {
                test: /\.css$/i,
                use: ['style-loader', 
                    {
                        loader:'css-loader',
                        options:{
                            modules: true,
                            sourceMap: true
                        }
                    }
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                    // Compiles Sass to CSS
                    {
                        loader: "sass-loader",
                        options: {
                            // Prefer `dart-sass`
                            implementation: require("sass"),
                            sourceMap: true,
                        },
                    },
                ],
            }
        ]
    }
}

module.exports = config;