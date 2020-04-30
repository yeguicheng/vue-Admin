// 过渡特殊字符
export function stripscript(str) {
    var pattern = new RegExp("\\s|[`~!@#$^&%*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
    var res = ''
    for (let i = 0; i < str.length; i++) {
        res += str.substr(i, 1).replace(pattern, '')
    }
    return res;
}
// 邮箱表单验证规则
export function VeriEmail(value) {
    let reg = /^[1-9]\d{7,10}@sina.com.cn$|@qq\.com$/
    if (!reg.test(value)) {
        return false
    }
    return true
}
// 密码表单验证规则
export function VeriPaw(value) {
    let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/
    if (!reg.test(value)) {
        return false
    }
    return true
}
// 验证码验证规则
export function VeriCode(val) {
    let reg = /^[a-z0-9]{6}/
    if (!reg.test(val)) {
        return false
    }
    return true
}