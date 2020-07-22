import {
	Post
} from '@/axiosRequest/index.js'

// 获取邮箱验证码
export function GetCode(data) {
	const url = '/getSms/'
	return Post(url, data)
}

//登录接口
export function Login(data) {
	const url = "/login/"
	return Post(url, data)
}

// 注册接口
export function Register(data) {
	const url = '/register/'
	return Post(url, data)
}

//退出接口
export function Logout(data = {}) {
	const url = "/logout/"
	return Post(url, data)
}
/**
 * 
 * @property {type} 获取某个用户的角色权限列表
 */
export function GetUserRole(data = {}) {
	const url = "/userRole/";
	return Post(url, data);
}
