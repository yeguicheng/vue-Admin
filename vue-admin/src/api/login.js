import { Post } from '@/axiosRequest/index.js'

// 获取邮箱验证码
export function GetCode(data) {
    const url = '/getSms/'
    return Post(url, data)
}

//登录接口
export function Login(data) {
    let url = "/login/"
    return Post(url, data)
}

// 注册接口
export function Register(data) {
    const url = '/register/'
    return Post(url, data)
}