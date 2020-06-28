import {
	reactive
} from "@vue/composition-api"
export function Paging() {
	const PagingParams = reactive({
		currentPage: 1,
		pageSize: 2,
		pageSizes: [10, 20, 30, 40],
		total: 0
	})
	// 改变tatol
	const changeTotal = (num) => {
		PagingParams.total = num
	}
	// 选择pageSizes时会触发
	const handleSizeChange = (val) => {
		console.log(`每页 ${val} 条`);
		PagingParams.pageSize = val
	}
	// currentPage 改变时会触发
	const handleCurrentChange = (val) => {
		console.log(`当前页: ${val}`);
		PagingParams.currentPage = val
	}
	return {
		PagingParams,
		changeTotal,
		handleSizeChange,
		handleCurrentChange
	}
}
