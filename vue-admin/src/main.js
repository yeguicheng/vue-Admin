import Vue from "vue";
// Vue3.0尝鲜版插件
import VueCompositionApi from '@vue/composition-api';
// UI插件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from "./App.vue";
// 路由
import router from "./router/index.js";
// import router from "./router/index _matcher.js";
// 路由守卫
import "./router/premit.js"
// Vuex
import store from "./store";
// Vue2.0自定义全局方法
// import globalMethods from "./utils/global.js";
// 自定义全局方法
import {
	ButtonJurisdiction
} from "@/utils/buttonJurisdiction.js"
// 按钮权限方法
Vue.prototype.ButtonJurisdiction = ButtonJurisdiction;
// 全局指令
import "./utils/button_jurisdiction_directive.js"
// 自定义全局组件
import "@/views/icons"
Vue
	// .use(globalMethods)
	.use(ElementUI)
	.use(VueCompositionApi)
Vue.config.productionTip = false;
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app");
