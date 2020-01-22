const isdev = process.env.NODE_ENV == "development";

export default {
    apiDomain: isdev ? "http://localhost:3000/" : ""
}