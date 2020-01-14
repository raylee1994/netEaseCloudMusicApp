const TerserPlugin = require("terser-webpack-plugin"); 
const iswsl = require("is-wsl");

const config = {
    mode: "production",
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.(js|jsx)(\?.*)?$/i,
                exclude: /node_modules/,
                cache: true,
                parallel: !iswsl,
                terserOptions: {
                    parse: {
                        ecma: 8  //es8及以下
                    },
                    compress: {
                        ecma: 5,  //es5及以下
                        comparisons: false,
                        inline: 2
                    },
                    output: {
                        ecma: 5  //es5及以下
                    }
                }
            })
        ]
    }
}