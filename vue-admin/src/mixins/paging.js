const paging = {
	data() {
		return {
			currentPage: 1,
			pageSize: 2,
			pageSizes: [10, 20, 30, 40],
			total: 0
		}
	},
	methods: {
		// 选择pageSizes时会触发
		handleSizeChange(val) {
			this.$set(this.tableConfig.requireData.data, "pageSize", val);
			this.TableData_Method(this.tableConfig.requireData)
			// PagingParams.pageSize = val
		},
		// currentPage 改变时会触发
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`);
			this.$set(this.tableConfig.requireData.data, "pageNumber", val);
			this.TableData_Method(this.tableConfig.requireData)
			// PagingParams.currentPage = val
		}
	},
	created() {}
}
export default paging;
