const baseConfig = require("./config");
const merge = require("webpack-merge");
const webpackBaseConfig = require("./webpack.base.config");

webpackBaseConfig.entry["dev-server"] = "webpack/hot/dev-server";
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