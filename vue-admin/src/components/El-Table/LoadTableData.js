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
		} = await loadData(params);
		const responseData = data.data;
		// 如果后台返回的数据不是一个数组类型，则需要这样判断
		if (data.resCode === 0) {
			TableData.item = responseData.data
			TableData.total = responseData.data.length === 0 ? 0 : responseData.total
		} else {
			throw data.message;
		}
	}
	return {
		TableData,
		TableData_Method
	}
}
