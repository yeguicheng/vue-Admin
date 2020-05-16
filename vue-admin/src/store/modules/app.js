import { Login } from "../../api/login"
import { setToken, setUsername, getUsername, RemoveToken, RemoveUsername } from "@/utils/app"
const state = {
    isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false,
    token: "",
    username: getUsername() || ""
}
const getters = {
    isCollapse: state => state.isCollapse
}
// 同步 没有回调函数处理
const mutations = {
    SET_COLLAPSE(state) {
        console.log("app")
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
    }
}
// 异步。可以回调函数
const actions = {
    // 用户登录
    login({ commit }, repuestData) {
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
    exit({ commit }) {
        return new Promise((resolve, reject) => {
            // 清空cokie中的用户信息
            RemoveToken()
            RemoveUsername()
            // 清空store中的用户信息
            commit("SET_TOKEN", "")
            commit("SET_USERNAME", "")
            resolve(true)
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