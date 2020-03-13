import {handleAction} from "redux-actions";
import * as types from "./actionType";
import defaultState from "./state";
import {combineReducers} from "redux";

const playStateReducer = handleAction(types.SWITCH_PLAY_STATE, (state, action) => action.payload, defaultState.playState)
const trackQueueReducer = handleAction(types.EDIT_TRACK_QUEUE, (state, action) => action.payload, defaultState.trackQueue)
const playerSettingReducer = handleAction(types.EDIT_PLAYER_SETTING, (state, action) => ({...state.player.playerSetting, ...action.payload}), defaultState.playerSetting)

export default combineReducers({
    playState: playStateReducer,
    trackQueue: trackQueueReducer,
    playerSetting: playerSettingReducer
})
