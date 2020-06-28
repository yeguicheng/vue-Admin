import axios from 'axios'
import { Message } from 'element-ui';
import {getToken,getUsername} from "./app.js"
const BASEURL = process.env.NODE_ENV === "production" ? "" : '/devapi'
const XmlHttpRequest = axios.create({
    baseURL: BASEURL,
    timeout: 5000
})

// 添加请求拦截器
XmlHttpRequest.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    config.headers["Tokey"] = getToken();
    config.headers["UserName"] = getUsername();
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
XmlHttpRequest.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    let data = response.data
    // 如果邮箱没有注册过（同时也在说明了,当前的操作是登录），则“data.resCode”等于“0”
    if (data && data.resCode !== 0) {
        Message.error(data.message)
        return data
    } else {
        // 否则就是已经注册过了
        return response
    }
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});
export default XmlHttpRequest