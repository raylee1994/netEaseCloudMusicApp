import * as types from "./actionType";
import {createAction} from "redux-actions";

export const switchPlayState = createAction(types.SWITCH_PLAY_STATE);
export const editTrackQueue = createAction(types.EDIT_TRACK_QUEUE);
export const editPlayerSetting = createAction(types.EDIT_PLAYER_SETTING);

export const insertTrackQueue = function(params = {trackQueue: [], song: null, triggerPlay: false}) {
    return function(dispatch) {
        let {trackQueue, song, triggerPlay} = params
        let playerSetting = JSON.parse(localStorage.getItem("_player_setting"))
        if(song) {
            let idArr = trackQueue.filter(item => {
                return song.id == item.id
            })
            if(idArr.length < 0) {
                trackQueue.push(song)
                dispatch(editTrackQueue(trackQueue))
                localStorage.setItem("_player_track_queue", JSON.stringify(trackQueue))
            }
            playerSetting = {
                ...playerSetting,
                index: playerSetting.index + 1
            }
        }else {
            let oldTrackQueue = triggerPlay ? [] : JSON.parse(localStorage.getItem("_player_track_queue"))
            trackQueue = oldTrackQueue.concat(oldTrackQueue)
            dispatch(editTrackQueue(trackQueue))
            localStorage.setItem("_player_track_queue", JSON.stringify(trackQueue))
            playerSetting = {
                ...playerSetting,
                index: 0
            }
        }
        triggerPlay && dispatch(editPlayerSetting({index: playerSetting.index}))
        triggerPlay && localStorage.setItem("_player_setting", JSON.stringify(playerSetting))
    }
}

export const deleteSong = function(params = {trackQueue: [], song: null}) {
    return function(dispatch) {
        let {trackQueue, song} = params
        if(song) {
            let idArr = trackQueue.map(item => item.id)
            let inArr = idArr.filter(item => song.id == item).length > 0
            if(!inArr) {
                return
            }
            let songIndex = idArr.indexOf(song.id)
            let playerSetting = JSON.parse(localStorage.getItem("_player_setting"))
            let currentIndex = playerSetting.index
            let edit = false
            if(songIndex < currentIndex) {
                playerSetting = {
                    ...playerSetting,
                    index: currentIndex-1
                }
                edit = true
            }
            if(songIndex == currentIndex && currentIndex == trackQueue.length-1) {
                playerSetting = {
                    ...playerSetting,
                    index: trackQueue.length-2
                }
                edit = true
            }
            trackQueue.splice(songIndex, 1)
            dispatch(editTrackQueue(trackQueue))
            localStorage.setItem("_player_track_queue", JSON.stringify(trackQueue))
            if(edit) {
                dispatch(editPlayerSetting({index: playerSetting.index}))
                localStorage.setItem("_player_setting", JSON.stringify(playerSetting))
            }
        }else {
            dispatch(editTrackQueue([]))
            localStorage.setItem("_player_track_queue", "[]")
        }
    }
}