import "babel-polyfill";
import React from "react";
import ReactDOM from 'react-dom';
import {AppContainer} from "react-hot-loader";
import {App} from "./app";

const isdev = process.env.NODE_ENV == "development";

ReactDOM.render(<AppContainer><App /></AppContainer>, document.getElementById("app"));

if(isdev && module.hot){
    module.hot.accept("./app.js", () => {
        const nextApp = require("./app.js").default;
        render(nextApp);
    });
}