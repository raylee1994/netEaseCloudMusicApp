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

export function createAjax(api, callback) {
    api.then(res => {
        if(res.data.code == 200) {
            callback(res)
        }else {
            alert(res.data.msg)
        }
    }, error => {
        if (error.response) {
            alert(error.response.data);
        } else if (error.request) {
            alert(error.request);
        } else {
            alert(error.message);
        }
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