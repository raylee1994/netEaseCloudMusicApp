import http from "apis/http";
import apisPath from "apis/paths";
import * as types from "./actionType";
import {createAction} from "redux-actions";
import {createAjaxAction} from "common/js/utils";
import qs from 'qs';

const switchUserStatus = createAction(types.SWITCH_USER_STATUS);
const setUserProfile = createAction(types.SET_USER_PROPFILE);

export const switchAuthModal = createAction(types.SWITCH_AUTH_MODAL);

export const login = function(params, successCallback, failCallback, errCallback) {
    return function (dispatch) {
        dispatch(switchUserStatus(1))
        http.post(apisPath["login/cellphone"], qs.stringify(params), {
            headers: {
                'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
            }
            }).then(res => {
            if(res.data.code == 200) {
                dispatch(switchUserStatus(2))
                dispatch(setUserProfile({
                    avatarUrl: res.data.profile.avatarUrl,
                    userId: res.data.profile.userId
                }))
                successCallback && successCallback(res)
            }else {
                dispatch(switchUserStatus(3))
                failCallback && failCallback(res)
            }
        }, err => {
            dispatch(switchUserStatus(3))
            errCallback && errCallback(err)
        })
    }
}

export const registerCellphone = function(params, successCallback, failCallback, errCallback) {
    return function (dispatch) {
        dispatch(switchUserStatus(1))
        http.post(apisPath["register/cellphone"], params).then(res => {
            if(res.data.code == 200) {
                dispatch(switchUserStatus(2))
                dispatch(setUserProfile({
                    avatarUrl: res.data.profile.avatarUrl,
                    userId: res.data.profile.userId
                }))
                successCallback && successCallback(res)
            }else {
                dispatch(switchUserStatus(3))
                failCallback && failCallback(res)
            }
        }, err => {
            dispatch(switchUserStatus(3))
            errCallback && errCallback(err)
        })
    }
}

export const loginRefresh = function() {
    return function (dispatch) {
        dispatch(switchUserStatus(1))
        http.get("batch?/api/login/token/refresh&/api/nuser/account/get").then(res => {
            if(res.data["/api/login/token/refresh"].code == 200 && res.data["/api/nuser/account/get"].code == 200) {
                dispatch(switchUserStatus(2))
                dispatch(setUserProfile({
                    avatarUrl: res.data.profile.avatarUrl,
                    userId: res.data.profile.userId 
                }))
            }else {
                dispatch(switchUserStatus(3))
            }
        }, err => {
            dispatch(switchUserStatus(3))
        })
    }
}


