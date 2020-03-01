
import React from "react";
import {Provider} from "react-redux";
import App from "./app";
import store from "./store";

function ReactApp() {
    return (
        <Provider store={store}><App /></Provider>
    )
}

export default ReactApp