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
    app: path.resolve(__dirname, "..", "src/index.js")
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
        // use: ["happypack/loader?id=babel"],
        loader: "babel-loader",
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
        use: ["happypack/loader?id=css"]
    },
    {
        test: cssModuleReg,
        exclude: /node_modules/,
        use: ["happypack/loader?id=cssModule"]
    },
    {
        test: lessReg,
        exclude: lessModuleReg,
        use: ["happypack/loader?id=less"]
    },
    {
        test: lessModuleReg,
        exclude: /node_modules/,
        use: ["happypack/loader?id=lessModule"]
    }
];

var resolve = {
    alias: {
        "@": path.resolve(__dirname, "..", "src"),
        "common": path.resolve(__dirname, "..", "src/common"),
        "components": path.resolve(__dirname, "..", "src/components"),
        "router": path.resolve(__dirname, "..", "src/router"),
        "store": path.resolve(__dirname, "..", "src/store"),
        "views": path.resolve(__dirname, "..", "src/views"),
        "apis": path.resolve(__dirname, "..", "src/apis")
    },
    extensions: [ ".js", ".less", ".css", ".jsx", ".json"]
};

var plugins = [
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "..", "index.html")
    }),
    new CopyWebpackPlugin([
        {
            from: path.resolve(__dirname, "..", "static"),
            to: "static"
        }
    ]),
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
            importLoaders: 2,
        }, {
            less: {
                sourceMap: isdev,
                javascriptEnabled: true
            }
        })
    }),
    new HappyPack({
        id: "lessModule",
        threadPool: HappyThreadPool,
        loaders: utils.resolveStyle({
            sourceMap: isdev,
            modules: true,
            importLoaders: 2,
        }, {
            less: {
                sourceMap: isdev,
                javascriptEnabled: true
            }
        })
    })
];

var devtool = isdev ? "cheap-module-eval-source-map" : "source-map";

var optimization = {
    splitChunks: {
        name: false,
        chunks: "all",
        cacheGroups: {
            vendor: {
                test: /[\\/]node_modules[\\/]/, // [\\/] 代表可以是\也可以是/
                name: "vendor",
                enforce: true,
                priority: 100
            }
        }
    },
    runtimeChunk: {
        name: "manifest"
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
    devtool,
    optimization
}