import {handleAction} from "redux-actions";
import {combineReducers} from "redux";
import defaultState from "./state";
import * as types from "./actionType";

const statusReducer = handleAction(types.SWITCH_USER_STATUS, (state, action) => action.payload, defaultState.status);
const profileReducer = handleAction(types.SET_USER_PROPFILE, (state, action) => action.payload, defaultState.profile);
const authModalVisibilityReducer = handleAction(types.SWITCH_AUTH_MODAL, (state, action) => action.payload, defaultState.authModalVisibility);

export default combineReducers({
    status: statusReducer,
    profile: profileReducer,
    authModalVisibility: authModalVisibilityReducer
})