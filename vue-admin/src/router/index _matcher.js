import Vue from "vue";
import Layout from "@/views/Layout";
import VueRouter from "vue-router";
Vue.use(VueRouter);

// 默认路由
export const defaultRouter = [{
		path: "/",
		// 当进入“/”路由时,重定向到“login”路由
		redirect: "login",
		hidden: true,
		meta: {
			name: "主页"
		}
	},
	{
		path: "/login",
		name: "login",
		hidden: true,
		meta: {
			name: "登录"
		},
		// 路由懒加载
		component: () => import("@/views/login/index.vue")
	},
	{
		path: "/console",
		name: "Console",
		meta: {
			name: "控制台",
			id: '1',
			icon: "console"
		},
		// 登录后的页面
		component: Layout,
		// 当进入“/console”这个路由时，进行重定向
		redirect: "consoleIndex",
		children: [{
			path: "/consoleIndex",
			name: "ConsoleIndex",
			show: true,
			meta: {
				name: "首页",
				id: '1-1',
				icon: "consoleIndex"
			},
			// alias:"/console",
			// 控制台页
			component: () => import("@/views/Console/index.vue")
		}]
	},
	// 404页面要放在最后
	// 方法1: 这里写法只能重新打开页面显示“ 404” 页面内容
	// {
	// 	path: '*',
	// 	name: '*',
	// 	hidden: true,
	// 	meta: {
	// 		name: "404",
	// 		id: '1',
	// 		icon: "404"
	// 	},
	// 	component: () => import("@/views/404/index.vue")
	// }
	// 方法2: 这里写法可以在当前页面显示“ 404” 页面内容
	{
		path: "/page404",
		meta: {
			name: "404",
			icon: "404"
		},
		hidden: true,
		component: Layout,
		children: [{
			path: "/404",
			meth: {
				name: "404"
			},
			component: () => import("@/views/404/index.vue")
		}]
	},
	// {
	// 	path: "*",
	// 	redirect: "/404"
	// }
]
const routes = defaultRouter;
// const router = new VueRouter({
// 	routes,
// 	mode: "history"
// });  

export const createRouter = routes => new VueRouter({
	// mode: 'history',
	base: process.env.BASE_URL,
	routes
});

// const router = createRouter(routes)
// export default router;
