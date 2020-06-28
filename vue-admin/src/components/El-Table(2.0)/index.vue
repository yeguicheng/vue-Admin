<template>
	<div>
		<!-- 表格 -->
		<el-table border :data="tableConfig.T_body" style="width: 100%" @selection-change="SelectionChange">
			<el-table-column v-if="tableConfig.is_selected" type="selection"></el-table-column>
			<template v-for="items of tableConfig.T_header ">
				<el-table-column v-if="items.type ==='slot'" :width="items.width" :key="items.id" :prop="items.Key" :label="items.label">
					<!-- v-slot这个这样做是因为elUi在底层也封装了一个插槽 -->
					<template v-slot="scope">
						<!-- 匿名插槽<slot></slot> -->
						<slot :name="items.SlotName" :data="scope.row"></slot>
					</template>
				</el-table-column>
				<el-table-column v-else :key="items.id" :prop="items.Key" :width="items.width" :label="items.label"></el-table-column>
			</template>
		</el-table>
		<!-- 分页 -->
		<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
		 :page-sizes="pageSizes" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper">
		</el-pagination>
	</div>

</template>

<script>
	// 表格数据
	// import {
	// 	LoadTable
	// } from "./LoadTableData.js"
	// 翻页记录
	import {
		recordPage
	} from "./recordPage.js"
	// 分页数据
	// import {
	// 	Paging
	// } from "./Paging.js"
	// 局部混入（按需引入）
	import myMixin_tableData
	from "@/mixins/tableData.js"
	import myMixin_pagingfrom from "@/mixins/paging.js"
	export default {
		name: "El_Table",
		mixins: [myMixin_tableData, myMixin_pagingfrom],
		data() {
			return {
				tableConfig: {
					// 请求的数据
					requireData: {},
					// 表头数据
					T_header: [],
					// 多选默认值
					is_selected: true,
					// 表体数据
					T_body: []
				}
			}
		},
		props: {
			options: {
				type: Object,
				default: () => {}
			}
		},
		methods: {
			// 将props的数据绑定
			Bind() {
				const datasKey = Object.keys(this.tableConfig)
				const data = this.options;
				for (const propertys in data) {
					// 如果“datas”中存在属性，则储存数据
					if (datasKey.includes(propertys)) {
						this.tableConfig[propertys] = data[propertys];
					} else {
						console.warn(propertys + " is no existent!")
						continue;
					}
				}
			},
			SelectionChange(selection) {
				// 执行父组件的函数
				emit("selection-change", selection)
			}
		},
		beforeMount() {
			// const {
			// 	TableData,
			// 	TableData_Method
			// } = LoadTable()
			this.Bind()
			// TableData_Method(this.requireData)
		}
		// setup(props, {
		// 	root,
		// 	emit
		// }) {
		// 	// 表格数据
		// 	const {
		// 		TableData,
		// 		TableData_Method
		// 	} = LoadTable()
		// 	// 分页数据
		// 	const {
		// 		PagingParams,
		// 		changeTotal,
		// 		handleSizeChange,
		// 		handleCurrentChange
		// 	} = Paging()
		// 	// watch监听
		// 	watch([() => TableData.item, () => TableData.total], ([tableData, totalCount]) => {
		// 		const res = JSON.parse(JSON.stringify(tableData))
		// 		if (res && res.length !== 0) {
		// 			res.map(items => {
		// 				items["Switch"] = true
		// 			})
		// 			datas.T_body = res
		// 		}
		// 		changeTotal(totalCount)
		// 	})
		// 	// 页码监听
		// 	watch([() => PagingParams.pageSize, () => PagingParams.currentPage], ([pageSize, currentPage]) => {

		// 		if (datas.requireData.data) {
		// 			Object.assign(datas.requireData.data, {
		// 				pageNumber: currentPage,
		// 				pageSize: pageSize
		// 			})
		// 			TableData_Method(datas.requireData)
		// 		}
		// 	})
		// 	// 生命周期
		// 	onBeforeMount(() => {
		// 		Bind()
		// 		TableData_Method(datas.requireData)
		// 	})
		// 	return {
		// 		datas,
		// 		PagingParams,
		// 		handleSizeChange,
		// 		handleCurrentChange,
		// 		SelectionChange
		// 	}
		// }
	}
</script>

<style>
</style>
