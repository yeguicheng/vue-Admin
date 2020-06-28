import {
	reactive
} from "@vue/composition-api"
import {
	loadData
} from "@/api/news.js"
export function LoadTable() {
	const TableData = reactive({
		item: [],
		total: 0
	})
	// 组件封装需求的数据接口
	const TableData_Method = async params => {
		let {
			data
		} = await loadData(params)
		if (data.resCode === 0) {
			TableData.item = data.data.data
			TableData.total = data.data.total
		} else {
			console.log(data.message)
		}
	}
	return {
		TableData,
		TableData_Method
	}
}
