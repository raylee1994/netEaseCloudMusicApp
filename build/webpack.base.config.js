var path = require("path");
var utils = require("./utils");
var config = require("./config");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");

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
    path: path.resolve(__dirname, "..", "dist"),
    filename: isdev ? "js/[name].[hash:8].js" : "js/[name].[chunkhash:8].js",
    chunkFilename: isdev ? "js/[id].[hash:8].js" : "js/[name].[chunkhash:8].js",
    publicPath: isdev ? config.dev.assetsPublicPath : config.build.assetsPublicPath
};

var rules = [
    {
        test: /\.(js|jsx)$/,
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
        loader: utils.resolveStyle({
            sourceMap: isdev,
            importLoaders: 1
        })
    },
    {
        test: cssModuleReg,
        exclude: /node_modules/,
        loader: utils.resolveStyle({
            sourceMap: isdev,
            modules: true,
            importLoaders: 1
        })
    },
    {
        test: lessReg,
        exclude: lessModuleReg,
        loader: utils.resolveStyle({
            sourceMap: isdev,
            importLoaders: 2
        }, {
            less: {
                sourceMap: isdev
            }
        })
    },
    {
        test: lessModuleReg,
        exclude: /node_modules/,
        loader: utils.resolveStyle({
            sourceMap: isdev,
            modules: true,
            importLoaders: 2
        }, {
            less: {
                sourceMap: isdev
            }
        })
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
    })
];

var devTool = isdev ? "cheap-module-eval-source-map" : "source-map";

var optimization = {

};