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
// 中文与中文的组合
export function VeriTitle(val) {
	const reg = /^[\u4e00-\u9fa5]/
	if (!reg.test(val)) {
		return false;
	}
	return true;
}
//手机号码
export function VeriPhon(val) {
	const reg = /^1[3567]\d{9}$/
	return reg.test(val)
}
// 转换为时间日期
export function transformationTime(time) {
	let Times = new Date(time * 1000);
	let Year = Times.getFullYear();
	let Month = (Times.getMonth() + 1) < 10 && `0${Times.getMonth()+1}` || (Times.getMonth() + 1);
	let date = Times.getDate() < 10 && `0${Times.getDate()}` || Times.getDate();
	let H = Times.getHours() < 10 && `0${Times.getHours()}` || Times.getHours();
	let M = Times.getMinutes() < 10 && `0${Times.getMinutes()}` || Times.getMinutes();
	let S = Times.getSeconds() < 10 && `0${Times.getSeconds()}` || Times.getSeconds();
	return `${Year}-${Month}-${date} ${H}:${M}:${S}`
}
