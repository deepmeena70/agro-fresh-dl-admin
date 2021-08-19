const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
    mode: 'production',
    devtool: 'source-map',
    module:{
        rules: [
            {
                test: /\.css$/,
                  use: [
                    {
                      // We configure 'MiniCssExtractPlugin'              
                      loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                    {
                      loader: 'postcss-loader'
                    }
                  ]
              }
        ]
    },
    plugins: [
          new MiniCssExtractPlugin({
            linkType: 'text/css',
            filename: 'styles/styles.[chunkhash].css'
        })
      ]
};

module.exports = config;