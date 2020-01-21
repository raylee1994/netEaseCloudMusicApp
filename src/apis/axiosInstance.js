import axios from "axios";
import config from "common/js/config";

const instance = axios.create({
    baseURL: config.apiDomain
});

