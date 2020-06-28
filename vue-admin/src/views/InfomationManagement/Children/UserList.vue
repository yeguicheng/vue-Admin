<template>
	<div class="userList">
		<el-row :gutter="20">
			<el-col :span="20">
				<div class="label-wrap key-word">
					<label for="">关键字:</label>
					<el-row :gutter="17">
						<el-col :span="4">
							<div>
								<el-select v-model="datas.ses" :options="datas.options" />
							</div>
						</el-col>
						<el-col :span="4">
							<el-input placeholder="请输入内容" v-model="datas.content"></el-input>
						</el-col>
						<el-col :span="14">
							<el-button type="danger">搜索</el-button>
						</el-col>
					</el-row>
				</div>

			</el-col>
			<el-col :span="4">
				<el-button class="pull-right" type="danger">添加用户</el-button>
			</el-col>
		</el-row>
		<div class="black-space-30"></div>
		<!-- 表格 -->
		<el-table :options="datas.Table_Options" @selection-change="SelectionChange">
			<template v-slot:Status="slotData">
				<!-- {{slotData.data.name}} -->
				<!-- v-model="slotData.data.Switch"：拿到子组件中的key作为变量来绑定 -->
				<el-switch v-model="slotData.data.Switch" active-color="#13ce66" inactive-color="#e6e6e6">
				</el-switch>
			</template>
			<template v-slot:Operation="slotData">
				<el-button type="danger" size="mini">删除</el-button>
				<el-button type="success" size="mini">编辑</el-button>
			</template>
		</el-table>
	</div>
</template>
<script>
	import {
		ref,
		reactive,
		onBeforeMount
	} from "@vue/composition-api"
	// 自封装的下拉列表
	import ElSelect from "@/components/El-Select"
	// 自封装的表格(3.0)
	// import ElTable from "@/components/El-Table/index.vue"
	// 自封装的表格(2.0)
	import ElTable from "@/components/El-Table(2.0)/index.vue"
	import requireURLs from "@/api/requireURLs.js"
	export default {
		name: "userList",
		components: {
			ElSelect,
			ElTable
		},
		setup(props, {
			root
		}) {
			const datas = reactive({
				Info_rmation: {
					KeyWord: ""
				},
				options: {
					values: ["name", "phon"]
				},
				Table_Options: {
					requireData: {
						url: requireURLs.getList,
						method: "POST",
						data: {
							pageNumber: 1,
							pageSize: 5
						}
					},
					// 多选
					is_selected: false,
					// 表头
					T_header: [{
							label: "邮箱/用户名",
							Key: "email",
							width: 220,
							id: 1
						},
						{
							label: "真实姓名",
							Key: "name",
							width: 220,
							id: 2
						},
						{
							label: "手机号",
							Key: "phon",
							width: 220,
							id: 3
						},
						{
							label: "角色",
							Key: "role",
							width: 200,
							id: 24
						},
						{
							label: "禁启用状态",
							type: "slot",
							SlotName: "Status",
							width: 110,
							id: 25,
						},
						{
							label: "操作",
							type: "slot",
							SlotName: "Operation",
							// width: 150,
							id: 26,
						}
					],
					// 表体
					// T_body: [{
					// 		email: '1483249153@qq.com',
					// 		name: '小张',
					// 		phon: '12983189381',
					// 		Switch: true,
					// 		role: '超管',
					// 	},
					// 	{
					// 		email: '1483249153@qq.com',
					// 		name: '王小虎',
					// 		phon: '12983189381',
					// 		Switch: true,
					// 		role: '超管'
					// 	},
					// 	{
					// 		email: '1483249153@qq.com',
					// 		name: '王小虎',
					// 		phon: '12983189381',
					// 		Switch: true,
					// 		role: '超管'
					// 	}
					// ]
				},
				content: ""
			})
			// methods
			const SelectionChange = (selection) => {
				console.log(selection)
			}
			// 生命周期
			onBeforeMount(() => {
				// console.log(requireURLs)
			})
			return {
				datas,
				SelectionChange
			}
		}
	}
</script>
<style lang="scss">
	@import "../../../styles/config.scss";

	.label-wrap {
		&.key-word {
			@include labelDom(left, 60, 40);
		}
	}
</style>
