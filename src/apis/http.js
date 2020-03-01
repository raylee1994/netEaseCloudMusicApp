import axios from "axios";
import config from "common/js/config";

const instance = axios.create({
    baseURL: config.apiDomain
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

