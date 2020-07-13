import store from "@/store/index.js"
import {
	getToken,
	RemoveToken,
	RemoveUsername
} from "@/utils/app.js"
// 路由(为什么要再次在这里引入路由对象？因为“main.js”中引入的路由对象是存放在实例上的，而这里没有办法获取实例)
import router from "./index.js";
// 设置页面白名单
const whiteRouter = ["/login"]
// 路由守卫
router.beforeEach((to, from, next) => {
	// 通过token来判断
	if (getToken()) {
		// 如果用户强制回到登录页面，则清除token和用户名
		// 去的页面 
		if (to.path === "/login") {
			RemoveToken()
			RemoveUsername()
			// 清空store中的用户信息与token
			store.commit("app/SET_TOKEN", "")
			store.commit("app/SET_USERNAME", "")
			next()
		} else {
			// 有token后。获取用户角色(接口)，动态分配路由权限
			if (store.getters["Permission/Get_Roles"].length === 0) {
				store.dispatch("Permission/GetUserRole").then(resolveData => {
					const UserRole = resolveData;
					store.dispatch("Permission/CreateRouter", UserRole).then(resolveData => {
						const AddRouter = store.getters["Permission/Get_AddRouter"]
						// router.addRoutes(AddRouter)
					})
				});
			}
			next()
		}
		// 进入对应的页面
		// next()
	} else {
		// 如果要访问(to)的路由(页面)在白名单上，则进入页面
		if (whiteRouter.indexOf(to.path) !== -1) {
			// 进入对应的页面
			next()
		} else {
			next("/login")
		}
		// next("/login")          //在这里这样做会造成死循环。因为这个是重定向。还是会触发路由的跳转

	}
})
