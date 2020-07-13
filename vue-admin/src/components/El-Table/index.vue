<template>
	<div>
		<!-- 表格 -->
		<el-table border :data="datas.T_body" style="width: 100%" @selection-change="SelectionChange">
			<el-table-column v-if="datas.is_selected" type="selection"></el-table-column>
			<template v-for="items of datas.T_header ">
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
		<div class="black-space-15">
			<el-row>
				<el-col :span="4">
					<slot name="BatchDelete"></slot>
				</el-col>
				<el-col :span="20">
					<!-- 分页 -->
					<el-pagination class="pull-right" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
					 :current-page="PagingParams.currentPage" :page-sizes="PagingParams.pageSizes" :page-size="PagingParams.pageSize"
					 :total="PagingParams.total" layout="total, sizes, prev, pager, next, jumper">
					</el-pagination>
				</el-col>
			</el-row>
		</div>
	</div>

</template>

<script>
	import {
		ref,
		reactive,
		onBeforeMount,
		watch
	} from "@vue/composition-api"
	// 表格数据
	import {
		LoadTable
	} from "./LoadTableData.js"
	// 翻页记录
	import {
		recordPage
	} from "./recordPage.js"
	// 分页数据
	import {
		Paging
	} from "./Paging.js"
	export default {
		name: "El_Table",
		props: {
			options: {
				type: Object,
				default: () => {}
			},
			SelectedRowData: {
				type: Object,
				default: () => {}
			}
		},
		setup(props, {
			root,
			emit,
			resf
		}) {
			// 表格数据
			const {
				TableData,
				TableData_Method
			} = LoadTable()
			// 分页数据
			const {
				PagingParams,
				changeTotal,
				handleSizeChange,
				handleCurrentChange
			} = Paging()
			// reactive
			const datas = reactive({
				// 请求的数据
				requireData: {},
				// 表头数据
				T_header: [],
				// 多选默认值
				is_selected: true,
				// 表体数据
				T_body: []
			})
			// methods
			const Bind = () => {
				const datasKey = Object.keys(datas)
				const data = props.options;
				for (const propertys in data) {
					// 如果“datas”中存在属性，则储存数据
					if (datasKey.includes(propertys)) {
						datas[propertys] = data[propertys];
					} else {
						console.warn(propertys + " is no existent!")
						continue;
					}
				}
			}
			// 重新更新表格的数据（无参时）
			const initTableData = () => {
				TableData_Method(datas.requireData)
			}
			// 重新更新表格的数据（有参时）
			const SearchTableData = (params) => {
				const params_data = Object.assign({}, datas.requireData.data, {
					[params.KeyWord.value]: params.content
				})
				datas.requireData.data = params_data;
				TableData_Method(datas.requireData)
			}
			// 多选项发生改变时
			const SelectionChange = (val) => {
				const row_data = {
					id: val.map(items => items.id)
				}
				/*
					方法1：
						通过sync修饰符传递数据给父组件
				*/
				emit("update:SelectedRowData", row_data);
				// 执行父组件的函数
				// emit("selection-change", selection)
				// 
			}
			// watch监听
			watch([() => TableData.item, () => TableData.total], ([tableData, totalCount]) => {
				const res = JSON.parse(JSON.stringify(tableData))
				// if (res && res.length !== 0) {
				// 	res.map(items => {
				// 		items["Switch"] = true
				// 	})
				// 	datas.T_body = res
				// }
				datas.T_body = res
				changeTotal(totalCount)
			})
			// 页码监听
			watch([() => PagingParams.pageSize, () => PagingParams.currentPage], ([pageSize, currentPage]) => {
				if (datas.requireData.data) {
					Object.assign(datas.requireData.data, {
						pageNumber: currentPage,
						pageSize: pageSize
					})
					TableData_Method(datas.requireData)
				}
			})
			// 生命周期
			onBeforeMount(() => {
				Bind()
				TableData_Method(datas.requireData)
			})
			return {
				datas,
				PagingParams,
				handleSizeChange,
				handleCurrentChange,
				SelectionChange,
				initTableData,
				SearchTableData
			}
		}
	}
</script>

<style scoped>
	.black-space-15 {
		padding: 15px 0;
	}
</style>
