import axios from "axios";
import config from "common/js/config";

const instance = axios.create({
    baseURL: config.apiDomain,
    headers: {
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
    }
});

const http = {
    get(url, params = {}) {
        return new Promise((resolve, reject) => {
            return instance.get(url,{
                params
            }).then(res => {
                return resolve(res)
            }).catch(err => {
                return reject(err)
            })
        })
    },
    post(url, data = {}) {
        return new Promise((resolve, reject) => {
            return instance.post(
                url,
                data
            ).then(res => {
                return resolve(res)
            }).catch(err => {
                return reject(err)
            })
        })
    }
}

export default http;

