var http = require('http');
var path = require('path');
var session = require('express-session') ;
var express = require('express');
const chokidar = require('chokidar');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const app = express();

app.use(require('morgan')('short'));


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

const webpackConf = require('./build/webpack.config.dev.js');
const webpackCompiller = webpack(webpackConf);

const hotMiddleware = webpackHotMiddleware(webpackCompiller);
const devMiddleWare = webpackDevMiddleware(
    webpackCompiller,
    {
        publicPath: webpackConf.output.publicPath,
    });

// Step 3: Attach the dev middleware and hot middleware to the server
app.use(devMiddleWare);
app.use(hotMiddleware);


app.active = ()=>{
    const watcher = chokidar.watch([
        path.resolve(__dirname, '/public/index.html'),// index.html is on the root folder
    ]);
    watcher.on('ready', function() {
        console.log('Initial scan complete. Ready for changes');
    });
    watcher.on('change', function(path) {
        console.log('File [' + path + '] changed !');
        // reload the client on file changes
        hotMiddleware.publish({action: 'reload'});
    });
}

app.active()

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(3000, function(err) {
    if (err) {
        console.error(err);
        return;
    }
    // log server running
    console.log('Listening at http://localhost:3000/');
});