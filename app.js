const fs = require('fs')
var path = require('path');
var express = require('express');
const bodyParser = require('body-parser');
const request = require('./util/request');
const chokidar = require('chokidar');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const cache = require('apicache').middleware;
const app = express();

app.use(require('morgan')('short'));

process.env.NODE_ENV = "development";
process.env.HOST = "localhost";
process.env.PORT = 8080;

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

// CORS & Preflight request
app.use((req, res, next) => {
    if(req.path !== '/' && !req.path.includes('.')){
        res.set({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'Content-Type': 'application/json; charset=utf-8'
        })
    }
    req.method === 'OPTIONS' ? res.status(204).end() : next()
})

// cookie parser
app.use((req, res, next) => {
    req.cookies = {}, (req.headers.cookie || '').split(/\s*;\s*/).forEach(pair => {
        let crack = pair.indexOf('=')
        if(crack < 1 || crack == pair.length - 1) return
        req.cookies[decodeURIComponent(pair.slice(0, crack)).trim()] = decodeURIComponent(pair.slice(crack + 1)).trim()
    })
    next()
})

// body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// cache
app.use(cache('2 minutes', ((req, res) => res.statusCode === 200)))

// router
const special = {
  'daily_signin.js': '/daily_signin',
  'fm_trash.js': '/fm_trash',
  'personal_fm.js': '/personal_fm'
}

fs.readdirSync(path.join(__dirname, './module')).reverse().forEach(file => {
    if(!file.endsWith('.js')) return
    let route = (file in special) ? special[file] : '/' + file.replace(/\.js$/i, '').replace(/_/g, '/')
    let question = require(path.join(__dirname, 'module', file))

    app.use(route, (req, res) => {
        let query = Object.assign({}, req.query, req.body, {cookie: req.cookies})
        question(query, request)
        .then(answer => {
            console.log('[OK]', decodeURIComponent(req.originalUrl))
            res.append('Set-Cookie', answer.cookie)
            res.status(answer.status).send(answer.body)
        })
        .catch(answer => {
            console.log('[ERR]', decodeURIComponent(req.originalUrl))
            if(answer.body.code == '301') answer.body.msg = '需要登录'
            res.append('Set-Cookie', answer.cookie)
            res.status(answer.status).send(answer.body)
        })
    })
})

app.active = ()=>{
    const watcher = chokidar.watch([
        path.resolve(__dirname, '/index.html'),// index.html is on the root folder
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

app.set('views', path.join(__dirname, 'src'));

app.use(require('connect-history-api-fallback')())

app.use(express.static(path.join(__dirname, 'dist')));

app.get("/*", function(req, res) {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(8888, function(err) {
    if (err) {
        console.error(err);
        return;
    }
    // log server running
    console.log('Listening at http://localhost:8888/');
});

module.exports = app
