import thunkMiddleware from 'redux-thunk';
import {createLogger} from "redux-logger";
import {createStore, applyMiddleware} from "redux";
import reducer from "./reducer";

const logMiddleware = createLogger();

export default createStore(reducer, applyMiddleware(thunkMiddleware, logMiddleware))