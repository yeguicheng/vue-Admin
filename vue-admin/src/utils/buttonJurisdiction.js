import store from "@/store/index.js"
export function ButtonJurisdiction(params) {
	const Admin_Role = store.getters["app/Get_Roles"];
	// 如果该账号是管理员
	if (Admin_Role.indexOf("admin") !== -1) {
		return true;
	}
	const ButtonJurisdictionList = store.getters["app/Get_Button"]
	return ButtonJurisdictionList.indexOf(params) !== -1;
}
