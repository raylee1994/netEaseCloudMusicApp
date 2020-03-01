import {combineReducers} from "redux";
import userReducer from "./User/reducer";
import playlistReducer from "./Playlist";
import {is_refresh_page} from "./Page";

export default combineReducers({
    is_refresh_page,
    user: userReducer,
    playlist: playlistReducer
})