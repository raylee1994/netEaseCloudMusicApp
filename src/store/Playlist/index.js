import {createAction, handleAction} from "redux-actions";
import {combineReducers} from "redux";
import {createAjax} from "common/js/utils";
import http from "apis/http";
import apisPaths from "apis/paths";

const GET_PLAYLIST_TAG = "GET_PLAY_LIST_TAG";

const getPlaylistTag = createAction(GET_PLAYLIST_TAG);

export const getPlaylistTag = () => dispatch => {
    createAjax(http.get(apisPaths["playlist/hot"], {}), res => {
        const list = [];
        res.tags.forEach(element => {
            list.push(element.playlistTag)
        });
        dispatch(getPlaylistTag(list));
    })
}

const playlistTagReducer = handleAction(GET_PLAYLIST_TAG, (state, action) => action.payload, []);

export default combineReducers({
    playlistTag: playlistTagReducer
})