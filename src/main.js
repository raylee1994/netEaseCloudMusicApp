import React from "react";
import ReactDom from "react-dom";
import {AppContainer} from "react-hot-loader";
import {App} from "./app";

ReactDOM.render(App, document.getElementById("app"));

if(module.hot){
    module.hot.accept("./app.js", () => {
        const nextApp = require("./app.js").default;
        render(nextApp);
    });
}