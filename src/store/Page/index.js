import {createAction, handleAction} from "redux-actions";

const REFRESH_PAGE = "REFRESH_PAGE";

export const refreshPage = createAction(REFRESH_PAGE);

export const is_refresh_page = handleAction(REFRESH_PAGE, (state, action) => action.payload, false)