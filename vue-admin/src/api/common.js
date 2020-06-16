import {
	Get_Category_All
} from "./news.js"
import {
	reactive
} from "@vue/composition-api"
export function common() {
	const Category_data = reactive({
		Category: []
	})
	//1: 外面要先调用这个接口，获取数据
	const Get_Category = async () => {
		let res = await Get_Category_All({});
		if (res.data.resCode === 0) {
			//2：储存数据 
			Category_data.Category = res.data.data
		}
	}
	return {
		Get_Category,
		// 返回这个数据
		Category_data
	}
}
