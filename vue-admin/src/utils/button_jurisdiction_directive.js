import Vue from "vue";
import store from "@/store/index.js"
Vue.directive("ButtonJurisdiction", {
	bind(el, bingind, vnode) {
		if (bingind.def.Button_Jurisdiction(bingind.value)) {
			// 实现隐藏元素
			// el.style.display = "none";
			// 添加类名实现显示元素
			el.className += " Button-Show"
		} else {
			// 添加类名实现显示元素
			el.className += " Button-hidden"
		}
	},
	inserted(el, bingind, vnode) {
		// console.log("2：",el)
	},
	Button_Jurisdiction(params) {
		const Admin_Role = store.getters["app/Get_Roles"];
		// 如果该账号是管理员
		if (Admin_Role.indexOf("admin") !== -1) {
			return true;
		}
		const ButtonJurisdictionList = store.getters["app/Get_Button"];
		return ButtonJurisdictionList.indexOf(params) !== -1;
	}
})
