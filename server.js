const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");
const express = require("express");
const {merge} = require("webpack-merge");

const app = express();
const common = require('./build-utils/webpack.common');
const config= require('./build-utils/webpack.prod');
const compiler = webpack(merge(common, config));

app.use(
  middleware(compiler, {
    // webpack-dev-middleware options
    publicPath: common.output.publicPath,
  })
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Example app is listening on ${PORT}`));