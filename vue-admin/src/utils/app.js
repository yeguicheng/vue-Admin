import cookie from "cookie.js";
const AdminToken = "admin-token"
const AdminUsername = "admin-username"

// 获取token
export function getToken() {
    return cookie.get(AdminToken);
}

// 设置token
export function setToken(token) {
    return cookie.set(AdminToken, token)
}

// 删除token
export function RemoveToken() {
    cookie.remove(AdminToken)
}

// 获取用户名
export function getUsername() {
    return cookie.get(AdminUsername)
}
// 设置用户名
export function setUsername(valus) {
    return cookie.set(AdminUsername, valus)
}
// 删除用户名
export function RemoveUsername() {
     cookie.remove(AdminUsername)
}