const webpack = require('webpack');
const merge = require("webpack-merge");
const webpackBaseConfig = require("./webpack.base.config");

// webpackBaseConfig.entry["dev-server"] = "webpack/hot/dev-server";
webpackBaseConfig.entry["webpack-hot-middleware"] = "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true";
webpackBaseConfig.entry["react-hot-loader"] = "react-hot-loader/patch";


var webpackConfig = merge({
    mode: "development",
    optimization: {
        moduleIds: "named",
        chunkIds: "named"
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}, webpackBaseConfig);

module.exports = webpackConfig