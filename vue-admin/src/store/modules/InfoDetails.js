const state = {
	Info_id: "" || sessionStorage.getItem("Info_id"),
	Info_title: "" || sessionStorage.getItem("Info_title")
}
const getters = {
	["Get_Info_id"]: state => state.Info_id,
	["Get_Info_title"]: state => state.Info_title
}
const mutations = {
	["Updates"](state, data) {
		for (const Key in data) {
			state[Key] = data[Key].value
			if (data[Key].isSession) {
				sessionStorage.setItem(Key, data[Key].value)
			}
		}
	}
}
const actions = {

}
export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}
