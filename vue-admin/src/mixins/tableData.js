// 表格数据
import {
	LoadTable
} from "@/components/El-Table(2.0)/LoadTableData.js"
import {
	loadData
} from "@/api/news.js"
const myMixin = {
	data() {
		return {
			message: "Mixin"
		}
	},
	methods: {
		// 组件封装需求的数据接口
		async TableData_Method(params) {
			let {
				data
			} = await loadData(params)
			if (data.resCode === 0) {
				this.tableConfig.T_body = data.data.data;
				this.total = data.data.total;
			} else {
				throw data.message;
				// console.log("请求错误",data.message)
			}
		}
	},
	mounted() {
		this.TableData_Method(this.tableConfig.requireData)
	},
	created() {
		// console.log("mixin", this.tableConfig)
	}
}
export default myMixin;
