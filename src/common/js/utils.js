import {message} from "antd";

export function errorMessage(msg) {
    message.destroy();
    message.open({
      content: msg
    });
}

export function isEmptyObject(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}

export function debounce(fn, delay=200) {
    var timer
    return function(args) {
        if(timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.call(this, ...args)
        }, delay)
    }
}

export function createAjax(api, callback, failCallback, errCallback) {
    api.then(res => {
        if(res.data.code == 200) {
            callback && callback(res)
        }else {
            errorMessage(res.data.msg)
            failCallback && failCallback(res)
        }
    }, error => {
        if (error.response) {
            errorMessage(error.response.data)
        } else if (error.request) {
            errorMessage(error.request)
        } else {
            errorMessage(error.message)
        }
        errCallback && errCallback()
    })
}

export function createAjaxAction(api, startAction, endAction, errAction) {
    return function(params) {
        return function(dispatch) {
            dispatch(startAction)
            api(params).then(res => {
                if(res.data.code == 200) {
                    dispatch(endAction)
                }else {
                    dispatch(errAction)
                }
            }, err => {
                dispatch(errAction)
            })
        }
    }
}

export function countTrasnform(count) {
    if(count < 10000) {
        return count
    }else {
        return (count/10000).toFixed(1) + '万'
    }
}