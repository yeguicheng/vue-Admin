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
	}
]
export const asyncRouter = [
	{
		// 信息管理。一级菜单标题
		path: "/infomationManagement",
		name: "InfomationManagement",
		meta: {
			system:"infoSystem",
			name: "信息管理",
			id: '2',
			icon: "InfomationManagement"
		},
		// 因为这个视图下才有整个主页的内容（左边菜单栏、顶部和中间动态的视图区），所以必须要加载这个视图才能实现
		component: Layout,
		// 当进入“/console”这个路由时，进行重定向
		children: [{

				path: "/infomationList",
				name: "InfomationList",
				show: true,
				meta: {
					// 二级菜单标题
					name: "信息列表",
					id: '2-1',
					icon: "InfomationList"
				},
				// 二级菜单页面
				component: () => import("@/views/InfomationManagement/Children/InfomationList.vue")
			},
			{

				path: "/infoClass",
				name: "InfoClass",
				show: true,
				meta: {
					// 二级菜单标题
					name: "信息分类",
					id: "2-2",
					icon: "InfoClass"
				},
				// 二级菜单页面
				component: () => import("@/views/InfomationManagement/Children/InfoClass.vue")
			},
			{
				path: "/infoDetails/:id",
				name: "infoDetails",
				show: false,
				meta: {
					// 二级菜单页面
					name: "信息管理",
					id: "2-3",
					icon: "InfoClass"
				},
				// 二级菜单页面
				component: () => import("@/views/InfomationManagement/Children/InfoDetails.vue")
			}
		]
	},
	{
		// 用户管理。一级菜单标题
		path: "/userMenagement",
		name: "UserMenagement",
		meta: {
			system:"userSystem",
			name: "用户管理",
			id: "3",
			icon: "UserMenagement"
		},
		component: Layout,
		// component: () => import("@/views/InfomationManagement/Children/UserList.vue"),
		children: [{
			path: "/userMenagement/userList",
			name: "UserList",
			show: true,
			meta: {
				name: "用户列表",
				id: "3-1",
				icon: "UserList"
			},
			component: () => import("@/views/UserMenagement/UserList.vue")
		}],

	}
]
const WholeRouter = [{
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
	}, {
		// 信息管理。一级菜单标题
		path: "/infomationManagement",
		name: "InfomationManagement",
		meta: {
			name: "信息管理",
			id: '2',
			icon: "InfomationManagement"
		},
		// 因为这个视图下才有整个主页的内容（左边菜单栏、顶部和中间动态的视图区），所以必须要加载这个视图才能实现
		component: Layout,
		// 当进入“/console”这个路由时，进行重定向
		children: [{

				path: "/infomationList",
				name: "InfomationList",
				show: true,
				meta: {
					// 二级菜单标题
					name: "信息列表",
					id: '2-1',
					icon: "InfomationList"
				},
				// 二级菜单页面
				component: () => import("@/views/InfomationManagement/Children/InfomationList.vue")
			},
			{

				path: "/infoClass",
				name: "InfoClass",
				show: true,
				meta: {
					// 二级菜单标题
					name: "信息分类",
					id: "2-2",
					icon: "InfoClass"
				},
				// 二级菜单页面
				component: () => import("@/views/InfomationManagement/Children/InfoClass.vue")
			},
			{
				path: "/infoDetails/:id",
				name: "infoDetails",
				show: false,
				meta: {
					// 二级菜单页面
					name: "信息管理",
					id: "2-3",
					icon: "InfoClass"
				},
				// 二级菜单页面
				component: () => import("@/views/InfomationManagement/Children/InfoDetails.vue")
			}
		]
	},
	{
		// 用户管理。一级菜单标题
		path: "/userMenagement",
		name: "UserMenagement",

		meta: {
			name: "用户管理",
			id: "3",
			icon: "UserMenagement"
		},
		component: Layout,
		// component: () => import("@/views/InfomationManagement/Children/UserList.vue"),
		children: [{
			path: "/userMenagement/userList",
			name: "UserList",
			show: true,
			meta: {
				name: "用户列表",
				id: "3-1",
				icon: "UserList"
			},
			component: () => import("@/views/UserMenagement/UserList.vue")
		}],

	}
]
const routes = defaultRouter;

const router = new VueRouter({
	routes
});

export default router;
