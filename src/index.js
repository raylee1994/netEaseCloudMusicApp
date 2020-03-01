import "babel-polyfill";
import React from "react";
import ReactDOM from 'react-dom';
import {AppContainer} from "react-hot-loader";
import ReactApp from "./main";
import "common/css/normalize";

const isdev = process.env.NODE_ENV == "development";

const render = Component => {
    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>,
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