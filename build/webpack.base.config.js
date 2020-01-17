const path = require("path");
const utils = require("./utils");
const config = require("./config");
const os = require("os");
const HappyPack = require("happypack");
const HappyThreadPool = HappyPack.ThreadPool({size: os.cpus().length - 1});
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isdev = process.env.NODE_ENV == "development";

const cssReg = /\.css$/;
const cssModuleReg = /\.module\.css$/;
const lessReg = /\.less$/;
const lessModuleReg = /\.module\.less$/;

var entry = {
    "react-hot-loader": "react-hot-loader/patch",
    app: path.resolve(__dirname, "..", "src/main.js")
};

var output = {
    path: path.resolve(__dirname, "..", config.outputPathname),
    filename: isdev ? "js/[name].[hash:8].js" : "js/[name].[chunkhash:8].js",
    chunkFilename: isdev ? "js/[id].[hash:8].js" : "js/[name].[chunkhash:8].js",
    publicPath: isdev ? config.dev.assetsPublicPath : config.build.assetsPublicPath
};

var rules = [
    {
        test: /\.(js|jsx)(\?.*)?$/,
        // loader: "babel-loader",
        use: ["happypack/loader?id=babel"],
        exclude: /node_modules/
    },
    {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: "url-loader",
        options: {
            name: "images/[name].[hash:8].[ext]",
            limit: 8192
        }
    },
    {
        test: cssReg,
        exclude: cssModuleReg,
        // use: utils.resolveStyle({
        //     sourceMap: isdev,
        //     importLoaders: 1
        // })
        use: ["happypack/loader?id=css"]
    },
    {
        test: cssModuleReg,
        exclude: /node_modules/,
        // use: utils.resolveStyle({
        //     sourceMap: isdev,
        //     modules: true,
        //     importLoaders: 1
        // })
        use: ["happypack/loader?id=cssModule"]
    },
    {
        test: lessReg,
        exclude: lessModuleReg,
        // use: utils.resolveStyle({
        //     sourceMap: isdev,
        //     importLoaders: 2
        // }, {
        //     less: {
        //         sourceMap: isdev
        //     }
        // })
        use: ["happypack/loader?id=less"]
    },
    {
        test: lessModuleReg,
        exclude: /node_modules/,
        // use: utils.resolveStyle({
        //     sourceMap: isdev,
        //     modules: true,
        //     importLoaders: 2
        // }, {
        //     less: {
        //         sourceMap: isdev
        //     }
        // })
        use: ["happypack/loader?id=lessModule"]
    }
];

var resolve = {
    alias: {
        "@": path.resolve(__dirname, "..", "src")
    },
    extensions: [ ".js", ".less", ".css", ".jsx", ".json"]
};

var plugins = [
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "..", "index.html")
    }),
    new CopyWebpackPlugin({
        form: path.resolve(__dirname, "..", "static"),
        to: "static"
    }),
    new HappyPack({
        id: "babel",
        threadPool: HappyThreadPool,
        loaders: ["babel-loader"]
    }),
    new HappyPack({
        id: "css",
        threadPool: HappyThreadPool,
        loaders: utils.resolveStyle({
            sourceMap: isdev,
            importLoaders: 1
        })
    }),
    new HappyPack({
        id: "cssModule",
        threadPool: HappyThreadPool,
        loaders: utils.resolveStyle({
            sourceMap: isdev,
            modules: true,
            importLoaders: 1
        })
    }),
    new HappyPack({
        id: "less",
        threadPool: HappyThreadPool,
        loaders: utils.resolveStyle({
            sourceMap: isdev,
            importLoaders: 2
        }, {
            less: {
                sourceMap: isdev
            }
        })
    }),
    new HappyPack({
        id: "lessModule",
        threadPool: HappyThreadPool,
        loaders: utils.resolveStyle({
            sourceMap: isdev,
            modules: true,
            importLoaders: 2
        }, {
            less: {
                sourceMap: isdev
            }
        })
    })
];

var devTool = isdev ? "cheap-module-eval-source-map" : "source-map";

var optimization = {
    splitChunks: {
        name: false,
        chunks: "all",
        cacheGroups: {
            vendor: {
                test: /[\\/]node_modules[\\/]/, // [\\/] 代表可以是\也可以是/
                name: "js/vendor",
                enforce: true,
                priority: 100
            }
        },
        runtimeChunk: {
            name: "js/manifest"
        }
    }
};

module.exports = {
    entry,
    output,
    module: {
        rules
    },
    resolve,
    plugins,
    devTool,
    optimization
}