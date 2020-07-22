import {
	Login,
	Logout
} from "../../api/login"
import {
	setToken,
	setUsername,
	getUsername,
	RemoveToken,
	RemoveUsername
} from "@/utils/app"
const state = {
	isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false,
	token: "",
	username: getUsername() || "",
	roles: [], //用户角色列表
	buttonJurisdiction: [], //用户按钮操作的权限
}
const getters = {
	isCollapse: state => state.isCollapse,
	/*由于这个是同步执行，所以执行的速度始终快于“SET_Roles”函数。结论就是这个获取的值终始是一个空数组*/
	["Get_Roles"]: state => state.roles,
	["Get_Button"]: state => state.buttonJurisdiction
}
// 同步 没有回调函数处理
const mutations = {
	SET_COLLAPSE(state) {
		state.isCollapse = !state.isCollapse
		// h5本地储存
		sessionStorage.setItem("isCollapse", JSON.stringify(state.isCollapse))
	},
	// 储存/清空用户令牌token
	SET_TOKEN(state, data) {
		state.token = data
	},
	// 储存/清空用户名
	SET_USERNAME(state, data) {
		state.username = data
	},
	// 储存用户角色列表
	["SET_Roles"](state, data) {
		// console.log("00")
		state.roles = data;
	},
	// 储存用户按钮权限列表
	["SET_Button"](state, data) {
		state.buttonJurisdiction = data
	}
}
// 异步。可以回调函数
const actions = {
	// 用户登录
	login({
		commit
	}, repuestData) {
		return new Promise((resolve, reject) => {
			Login(repuestData).then(response => {
				let data = response.data.data
				commit("SET_TOKEN", data.token)
				commit("SET_USERNAME", data.username)
				// cookie
				// 设置token
				setToken(data.token)
				// 设置用户名
				setUsername(data.username)
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},
	// 用户退出
	logout({ commit }) {
		return new Promise(async (resolve, reject) => {
			const res = await Logout()
			// 清空cokie中的用户信息
			RemoveToken()
			RemoveUsername()
			// 清空store中的用户信息
			commit("SET_TOKEN", "")
			commit("SET_USERNAME", "")
			commit("SET_Roles", [])
			resolve(res)
			reject(false)
		})
	}
}
export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}
