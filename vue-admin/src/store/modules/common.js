import {
	Get_Category_All
} from "@/api/news.js"
const common = {
	state: {
		qiniuURL: "http://qny.ygc.gold/"
	},
	getters: {
		["GET_QINIU_URL"]: state => state.qiniuURL
	},
	actions: {
		["GetCategory"](context, data) {
			/*方法1*/
			// return new Promise(async(resolve, reject) => {
			// 	let res = await Get_Category_All({});
			// 	resolve(res.data.data)
			// })
			/*方法2*/
			return new Promise((resolve, reject) => {
				Get_Category_All({}).then(res => {
					resolve(res.data.data)
				}).catch(err => {
					reject(err)
				})
			})
		}
	}
}
export default common;
