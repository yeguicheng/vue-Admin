import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import app from "./modules/app.js"
import login from "./modules/login.js"
import common from "./modules/common.js"
import InfoDetails from "./modules/InfoDetails.js"
import Permission from "./modules/permission.js"
export default new Vuex.Store({
	modules: {
		app,
		login,
		common,
		InfoDetails,
		Permission
	}
});
