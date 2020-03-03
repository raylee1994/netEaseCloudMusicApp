import "babel-polyfill";
import React from "react";
import ReactDOM from 'react-dom';
import ReactApp from "./main";
import {Provider} from "react-redux";
import store from "./store";
import "common/css/normalize";

const isdev = process.env.NODE_ENV == "development";

const render = Component => {
    ReactDOM.render(
        <Provider store={store}>
            <Component />
        </Provider>,
        document.getElementById("app")
    );
}

render(ReactApp);

if(isdev && module.hot){
    module.hot.accept("./main.js", () => {
        const nextApp = require("./main.js").default;
        render(nextApp);
    });
}