const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");

var config = {
    mode: "development",
    optimization: {
        moduleIds: "named",
        chunkIds: "named",
        nodeEnv: "development"
    },
    devServer: {
        
    }
}