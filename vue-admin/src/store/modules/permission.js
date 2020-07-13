import {
	GetUserRole
} from "@/api/login.js"
import {
	defaultRouter,
	asyncRouter
} from "@/router/index.js"
const Permission = {
	namespaced: true,
	state: {
		roles: [], //用户角色列表
		AllRouter: defaultRouter,
		AddRouter: []
	},
	getters: {
		// 获取用户角色列表
		/*由于这个是同步执行，所以执行的速度始终快于“SET_Roles”函数。结论就是这个获取的值终始是一个空数组*/
		["Get_Roles"]: state => state.roles,
		["Get_AddRouter"]: state => state.AddRouter,
		["Get_AllRouter"]: state => state.AllRouter,
	},
	mutations: {
		// 储存用户角色列表
		["SET_Roles"](state, data) {
			state.roles = data;
		},
		// 储存动态路由
		["SET_AddRouter"](state, data) {
			state.AddRouter = data;
			state.AllRouter = state.AllRouter.concat(state.AddRouter);
		}
	},
	actions: {
		// 异步获取用户角色列表
		["GetUserRole"]({
			commit
		}) {
			return new Promise(async (resolve, reject) => {
				let {
					data
				} = await GetUserRole();
				if (data.resCode === 0) {
					const Role_List = data.data.role;
					commit("SET_Roles", Role_List);
					resolve(Role_List)
				}

			})
		},
		// 创建动态路由
		["CreateRouter"]({
			commit
		}, data) {
			return new Promise((reslove, reject) => {
				const UserRole = data;
				const res = asyncRouter.filter(items => {
					if (UserRole.includes(items.meta.system)) {
						return items
					}
				})
				// 更新路由
				commit("SET_AddRouter", res);
				reslove()
			})
		}
	}
}
export default Permission
