import {
	Post
} from '@/axiosRequest/index.js'

// 获取用户角色权限列表
export function GetRole(data = {}) {
	const url = '/role/';
	return Post(url, data)
}
// 获取系统权限列表
export function GetSystem(data = {}) {
	const url = '/system/';
	return Post(url, data)
}
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
