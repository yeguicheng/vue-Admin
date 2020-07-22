import {
	Post
} from '@/axiosRequest/index.js'

// 获取角色列表
export function GetRole(data = {}) {
	const url = '/role/';
	return Post(url, data)
}
// 获取用户按钮权限列表
export function GetPermButton(data = {}) {
	const url = '/permButton/';
	return Post(url, data)
}
// 获取系统权限列表
export function GetSystem(data = {}) {
	const url = '/system/';
	return Post(url, data)
}
// //  获取某个用户的角色权限列表
// export function GetUserRole(data = {}) {
// 	const url = '/userRole/';
// 	return Post(url, data)
// }
// 添加用户
export function UserAdd(data) {
	const url = "/user/add/";
	return Post(url, data)
}
// 删除用户
export function UserDelete(data) {
	const url = "/user/delete/"
	return Post(url, data)
}
// 编辑用户
export function UserEdit(data) {
	const url = "/user/edit/";
	return Post(url, data)
}
// 用户禁启用
export function UserActives(data) {
	const url = "/user/actives/"
	return Post(url, data)
}
