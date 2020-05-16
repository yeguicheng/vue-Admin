import store from "@/store/index.js"
import { getToken, RemoveToken, RemoveUsername } from "@/utils/app.js"
// 路由
import router from "./index.js";
const whiteRouter = ["/login"]

// 路由守卫
router.beforeEach((to, from, next) => {
    // 通过token来判断
    if (getToken()) {
        if (to.path === "/login") {
            // 如果用户强制回到登录页面，则清除token和用户名
            RemoveToken()
            RemoveUsername()
            // 清空store中的用户信息与token
            store.commit("app/SET_TOKEN", "")
            store.commit("app/SET_USERNAME", "")
            next()
        } else {
            // 有token后。获取用户角色，动态分配路由权限
            next()
        }
        // 进入对应的页面
        next()
    } else {
        // 如果要访问(to)的路由(页面)在白名单上，则进入页面
        // 'consoleIndex'
        if (whiteRouter.indexOf(to.path) !== -1) {
            // 进入对应的页面
            next()
        }
        else {
            next("/login")
        }
        // next("/login")          //这样做会造成死循环。因为这个是重定向。还是会触发路由的跳转

    }
    // console.log(to)
    // console.log(from)
    // next()
})