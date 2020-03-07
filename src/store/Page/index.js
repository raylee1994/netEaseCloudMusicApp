import {createAction, handleAction} from "redux-actions";

const REFRESH_PAGE = "REFRESH_PAGE";
const PAGE_LOADED = "PAGE_LOADED";

export const refreshPage = createAction(REFRESH_PAGE);
export const pageLoaded = createAction(PAGE_LOADED);

export const is_refresh_page = handleAction(REFRESH_PAGE, (state, action) => action.payload, false)
export const is_page_loaded = handleAction(PAGE_LOADED, (state, action) => action.payload, false)