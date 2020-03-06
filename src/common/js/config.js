const isdev = process.env.NODE_ENV == "development";

export default {
    apiDomain: isdev ? "http://localhost:8888/" : ""
}