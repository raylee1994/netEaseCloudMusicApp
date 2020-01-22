import http from "apis/http";

export function LogInCellphone(data) {
    return http.post({
        url: "login/cellphone",
        data
    }).then(res => {
        return Promise.resolve(res)
    }).catch(err => {
        return Promise.reject(err)
    })
}