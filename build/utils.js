import MiniCssExtractPlugin from "mini-css-extract-plugin";

exports.resolveStyle = function(loaderOptions, processor) {
    const isdev = process.env.NODE_ENV == "development";

    let loaders = [
        !isdev && MiniCssExtractPlugin.loader,
        isdev && {
            loader: "style-loader",
            options: {
                sourceMap: true
            }
        },
        {
            loader: "css-loader",
            options: loaderOptions
        },
        {
            loader: "postcss-loader",
            sourceMap: isdev
        }
    ].filter(Boolean);

    for(let ext in processor) {
        let options = processor[ext];
        loaders.push({
            loader: ext + "-loader",
            options: options
        })
    }

    return loaders
}