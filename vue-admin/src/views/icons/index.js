import Vue from "vue";
import svgIcon from "./SvgIcon.vue"
// 全局组件
Vue.component("SvgIcon", svgIcon)
const req = require.context("./svg", false, /\.svg$/)
const requireContext = requireContext => {
    return requireContext.keys().map(requireContext)
}
requireContext(req)