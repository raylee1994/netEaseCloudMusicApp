import * as types from "./actionType";
import {createAction} from "redux-actions";

export const switchPlayState = createAction(types.SWITCH_PLAY_STATE);
export const editTrackQueue = createAction(types.EDIT_TRACK_QUEUE);
export const editPlayerSetting = createAction(types.EDIT_PLAYER_SETTING);

export const insertTrackQueue = function(params = {trackQueue: JSON.parse(localStorage.getItem("_player_track_queue")), song: null, triggerPlay: false}) {
    return function(dispatch) {
        let {trackQueue, song, triggerPlay} = params
        if(song) {
            let idArr = trackQueue.filter(item => {
                return song.id == item.id
            })
            if(idArr.length < 0) {
                trackQueue.push(song)
                dispatch(editTrackQueue(trackQueue))
                localStorage.setItem("_player_track_queue", JSON.stringify(trackQueue))
            }
            triggerPlay && dispatch(editPlayerSetting({id: song.id}))
            let playerSetting = JSON.parse(localStorage.getItem("_player_setting"))
            playerSetting = {
                ...playerSetting,
                id: song.id
            }
            localStorage.setItem("_player_setting", JSON.stringify(playerSetting))
        }else {
            
        }
    }
}

export const deleteSong = function(params = {trackQueue: JSON.parse(localStorage.getItem("_player_track_queue")), song: null}) {
    return function(dispatch) {
        let {trackQueue, song} = params
        if(song) {
            
        }else {
            dispatch(editTrackQueue([]))
            localStorage.setItem("_player_track_queue", "[]")
        }
    }
}