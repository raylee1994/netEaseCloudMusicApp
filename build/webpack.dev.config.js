const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const baseConfig = require("./config");
const merge = require("webpack-merge");
const webpackBaseConfig = require("./webpack.base.config");
const portfinder = require("portfinder");
const nodeNotifier = require("node-notifier");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");

webpackBaseConfig.entry["dev-server"] = "webpack/hot/dev-server";
webpackBaseConfig.entry["react-hot-loader"] = "react-hot-loader/patch";

process.env.NODE_ENV = "development";
process.env.HOST = "localhost";
process.env.PORT = 8080;

const serverOptions = {
    host: process.env.HOST,
    port: process.env.PORT,
    hot: true,
    historyApiFallback: {
        disableDotRule: true
    },
    https: process.env.HTTPS === 'true',
    proxy: baseConfig.dev.proxy ? baseConfig.dev.proxy : {},
    publicPath: baseConfig.dev.assetsPublicPath
};

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

portfinder.basePort = process.env.PORT;
portfinder.getPortPromise().then(port => {
    process.env.PORT = port;
    serverOptions.port = port;
    webpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: [
                    `Your application is running here: http://${process.env.HOST}:${port}`
                ]
            },
            onErrors: (severity, errors) => {
                if (severity !== "error") {
                    return;
                }
                const error = errors[0];
                nodeNotifier.notify({
                    title: "Webpack error",
                    message: severity + ": " + error.name,
                    subtitle: error.file || ""
                });
            }
        })
    );
    const compiler = webpack(webpackConfig);
    const server = new WebpackDevServer(compiler, serverOptions);
    server.listen(port, process.env.HOST, err => {
        if (err) {
            return console.log(err);
        }
    })
}).catch(err => {
    return console.log(err);
});