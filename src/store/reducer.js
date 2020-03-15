import {combineReducers} from "redux";
import userReducer from "./User/reducer";
import playerReducer from "./Player/reducer";
import playlistReducer from "./Playlist";
import {is_refresh_page, is_page_loaded} from "./Page";

export default combineReducers({
    is_refresh_page,
    is_page_loaded,
    user: userReducer,
    playlist: playlistReducer,
    // player: playerReducer
})