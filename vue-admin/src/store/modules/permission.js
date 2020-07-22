import {
	GetUserRole
} from "@/api/login.js"
import {
	defaultRouter,
	asyncRouter
} from "@/router/index.js"

// 匹配角色
function RoleMatching(asyncRouter_Item, UserRole) {
	if (asyncRouter_Item.meta && asyncRouter_Item.meta.role) {
		// const res = Role.some(items => UserRole.indexOf(items) !== -1);
		const res = UserRole.some(items => asyncRouter_Item.meta.role.indexOf(items) !== -1);
		return res;
	} else {
		return false;
	}
}
// 递归函数
function DeenCallback(Arr_Obj, UserRole, RoleMatching) {
	let After = Arr_Obj || [];
	const list = After.filter(items => {
		if (RoleMatching(items, UserRole)) {
			if (items.children && items.children.length > 0) {
				items.children = DeenCallback(items.children, UserRole, RoleMatching);
			}
			return items
		};
	})
	return list;
}
const Permission = {
	namespaced: true,
	state: {
		AllRouter: defaultRouter,
		AddRouter: []
	},
	getters: {
		// 获取用户角色列表
		/*由于这个是同步执行，所以执行的速度始终快于“SET_Roles”函数。结论就是这个获取的值终始是一个空数组*/
		["Get_AddRouter"]: state => state.AddRouter,
		["Get_AllRouter"]: state => state.AllRouter,
	},
	mutations: {
		// 储存动态路由
		["SET_AddRouter"](state, data) {
			state.AddRouter = data;
			// 这里不能用 “state.AllRouter”作为拼接。因为“ state.AllRouter ”在没有刷新的情况下，储存的是上一次的“拼接”。
			// console.log("匹配后的路由为：",state.AddRouter)
			state.AllRouter = defaultRouter.concat(data);
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
					// 请求角色权限列表
					const Role_List = data.data;
					// 因为在执行不同的文件，并且是执行“mutations”函数（同步函数），所以会出现数据获取的速度问题
					// commit("app/SET_Roles", Role_List);
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
				let res = [];
				// 如果是超级管理员
				if (UserRole.includes("admin")) {
					res = asyncRouter;
				} else { // 如果是普通员工
					res = DeenCallback(asyncRouter, UserRole, RoleMatching);
					res.push(asyncRouter[asyncRouter.length - 1])
					// res = asyncRouter.filter(items => {
					// 	// if (UserRole.includes(items.meta.system)) {
					// 	// 	return items
					// 	// }
					// 	if (RoleMatching(items, UserRole)) {
					// 		if (items.children && items.children.length > 0) {
					// 			items.children = items.children.filter(children => {
					// 				if (RoleMatching(children, UserRole)) {
					// 					if (children.children && children.children.length > 0) {
					// 						children.children = children.children.filter(children2 => {
					// 							if (RoleMatching(children2, UserRole)) {
					// 								return children
					// 							}
					// 						})
					// 					}
					// 					return children
					// 				}
					// 			})

					// 		}
					// 		return items
					// 	};
					// })

				}
				// 更新路由
				commit("SET_AddRouter", res);
				reslove()
			})
		}
	}
}
export default Permission
