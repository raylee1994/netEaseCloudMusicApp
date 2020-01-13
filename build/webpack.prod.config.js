const TerserPlugin = require("terser-webpack-plugin"); 

const config = {
    mode: "production",
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.(js|jsx)(\?.*)?$/i,
                exclude: /node_modules/
            })
        ]
    }
}