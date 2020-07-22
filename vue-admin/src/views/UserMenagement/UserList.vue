<template>
	<div class="userList">
		<el-row :gutter="20">
			<el-col :span="20">
				<div class="label-wrap key-word">
					<label for="">关键字:</label>
					<el-row :gutter="17">
						<el-col :span="4">
							<div>
								<key-el-select v-model="datas.KeyWord" @SelectMethod="_SelectMethod" :options="datas.options"
								 :key_word_selected.sync="datas.Info_rmation.KeyWord" />
							</div>
						</el-col>
						<el-col :span="4">
							<el-input placeholder="请输入内容" @clear="Cleared" clearable v-model="datas.Info_rmation.content"></el-input>
						</el-col>
						<el-col :span="14">
							<el-button type="danger" @click="Searched">搜索</el-button>
						</el-col>
					</el-row>
				</div>
			</el-col>
			<el-col :span="4">
				<!-- 使用全局方法实现按钮权限设置 -->
				<!-- <el-button class="pull-right" type="danger" @click="AddUser" v-if="ButtonJurisdiction('user:add')">添加用户</el-button> -->
				<!-- 使用全局指令实现按钮权限设置 -->
				<el-button class="pull-right" type="danger" @click="AddUser" v-ButtonJurisdiction="'user:add'">添加用户</el-button>
			</el-col>
		</el-row>
		<div class="black-space-30"></div>
		<!-- 表格 -->
		<el-table ref="UesrTable" :options="datas.Table_Options" :SelectedRowData.sync="datas.SelectedRowData"
		 @selection-change="SelectionChange">
			<!-- 作用域插槽 -->
			<template v-slot:Status="slotData">
				<!-- v-model="slotData.data.Switch"：拿到子组件中的key作为变量来绑定 -->
				<el-switch @change="UserSwitch(slotData.data)" v-model="slotData.data.status" active-value="2" inactive-value="1"
				 active-color="#13ce66" inactive-color="#e6e6e6">
				</el-switch>
			</template>
			<!-- 作用域插槽 -->
			<template v-slot:Operation="slotData">
				<!-- 使用全局方法实现按钮权限设置 -->
				<!-- <el-button type="danger" size="mini" @click="DeleteItem(slotData.data.id)" v-if="ButtonJurisdiction('user:del')">删除</el-button> -->
				<!-- <el-button type="success" size="mini" @click="UserEdit(slotData.data)" v-if="ButtonJurisdiction('user:edit')">编辑</el-button> -->
				<!-- 使用全局指令实现按钮权限设置 -->
				<el-button type="danger" size="mini" @click="DeleteItem(slotData.data.id)" v-ButtonJurisdiction="'user:del'">删除</el-button>
				<el-button type="success" size="mini" @click="UserEdit(slotData.data)" v-ButtonJurisdiction="'user:edit'">编辑</el-button>
			</template>
			<!-- 具名插槽 -->
			<template v-slot:BatchDelete>
				<!-- 使用全局方法实现按钮权限设置 -->
				<!-- <el-button size="mini" @click="BatchDeleted" v-if="ButtonJurisdiction('user:batchDel')">批量删除</el-button> -->
				<!-- 使用全局指令实现按钮权限设置 -->
				<el-button size="mini" @click="BatchDeleted" v-ButtonJurisdiction="'user:batchDel'">批量删除</el-button>
			</template>
		</el-table>
		<!-- 添加用户和编辑用户的弹窗  -->
		<addDialog :flag.sync="datas.dialog_addUser" :UserEdit="datas.UserEdit" />
	</div>
</template>
<script>
	import {
		ref,
		reactive,
		onMounted,
		onBeforeMount
	} from "@vue/composition-api"
	// 自封装的下拉列表
	import keyElSelect from "@/components/El-Select"
	// 自封装的表格(2.0)
	// import ElTable from "@/components/El-Table(2.0)/index.vue"
	// 自封装的表格(3.0)
	import ElTable from "@/components/El-Table"
	import requireURLs from "@/api/requireURLs.js"
	// 添加用户的弹窗
	import addDialog from "./dialog/add.vue"
	// 添加删除用户弹窗
	import {
		global
	} from "@/utils/global_V3.0.js"
	// 删除用户接口
	import {
		UserDelete,
		UserActives
	} from "@/api/user.js"
	export default {
		name: "userList",
		components: {
			keyElSelect,
			ElTable,
			addDialog
		},
		setup(props, {
			root,
			refs
		}) {
			// const UesrTable = ref(null);
			const {
				confirm
			} = global();
			const datas = reactive({
				// 节流
				throttle: true,
				// 多选项中的数据
				SelectedRowData: {},
				dialog_addUser: false, //弹窗中的开关状态
				KeyWord: "姓名",
				Info_rmation: {
					KeyWord: {},
					content: "",
				},
				options: ["truename", "phone"],
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
					is_selected: true,
					// 表头
					T_header: [{
							label: "邮箱/用户名",
							Key: "username",
							width: 220,
							id: 1
						},
						{
							label: "真实姓名",
							Key: "truename",
							width: 150,
							id: 2
						},
						{
							label: "手机号",
							Key: "phone",
							width: 180,
							id: 3
						},
						{
							label: "地区",
							Key: "region",
							width: 220,
							id: 4
						},
						{
							label: "角色",
							Key: "role",
							width: 200,
							id: 5
						},
						{
							label: "禁启用状态",
							type: "slot",
							SlotName: "Status",
							width: 110,
							id: 6,
						},
						{
							label: "操作",
							type: "slot",
							SlotName: "Operation",
							// width: 200,
							id: 7,
						}
					],
				},
				// 用户编辑数据
				UserEdit: {}
			})
			// methods
			// 批量删除
			const CallBack_deleteInfo = async ids => {
				let {
					data
				} = await UserDelete({
					id: ids
				});
				if (data && data.resCode === 0) {
					// 重新更新表格的数据
					refs.UesrTable.initTableData();
					// console.log("ChildInstance:", UesrTable.value)
				} else {
					if (data) throw data.message
				}
			}
			const BatchDeleted = () => {
				const ids = datas.SelectedRowData.id;
				if (ids === void 0 || ids.length === 0) {
					root.$message({
						message: "请选择要删除的选项!",
						type: "warning"
					})
					return false;
				}
				confirm({
					content: "确定删除该信息吗？删除后将无法恢复!",
					id: ids,
					type: "warning",
					tip: "警告",
					fn: CallBack_deleteInfo
				})
			}
			// 单个删除
			const DeleteItem = (id) => {
				confirm({
					content: "确定删除该信息吗？删除后将无法恢复!",
					id: [id],
					type: "warning",
					tip: "警告",
					fn: CallBack_deleteInfo
				})
			}
			// 用户添加
			const AddUser = (val) => {
				datas.dialog_addUser = true;
				// 数据浅拷贝
				datas.UserEdit = Object.assign({});
			}
			// 用户编辑
			const UserEdit = (val) => {
				datas.dialog_addUser = true;
				// 数据浅拷贝
				datas.UserEdit = Object.assign({}, val);
			}
			// 用户状态开关
			const UserSwitch = async ({
				id,
				status
			}) => {
				if (!datas.throttle) return false;
				datas.throttle = false;
				let {
					data
				} = await UserActives({
					id,
					status
				})
				if (data && data.resCode === 0) {
					root.$message({
						message: data.message,
						type: "success"
					})
					datas.throttle = true;
				} else {
					datas.throttle = true;
					console.warn("参数错误!")
				}
			}
			const SelectionChange = (selection) => {
				console.log(selection)
			}
			// 关键字Select中的change事件
			const _SelectMethod = (resVal) => {
				datas.KeyWord = resVal;
			}
			// 搜索时
			const Searched = () => {
				console.log(datas.Info_rmation)
				refs["UesrTable"].SearchTableData(datas.Info_rmation)
			}
			// 点击清除图标时
			const Cleared = () => {
				root.$set(datas.Info_rmation, "content", "")
				// root.$set(datas.Info_rmation, "KeyWord", "")
				// refs["UesrTable"].initTableData()
			}
			// 生命周期
			onBeforeMount(() => {})
			onMounted(() => {
				// console.log("ChildInstance:", UesrTable.value)
			})
			return {
				datas,
				BatchDeleted,
				SelectionChange,
				DeleteItem,
				UserSwitch,
				AddUser,
				UserEdit,
				Searched,
				Cleared,
				_SelectMethod
			}
		}
	}
</script>
<style lang="scss">
	@import "@/styles/config.scss";

	.label-wrap {
		&.key-word {
			@include labelDom(left, 60, 40);
		}
	}
</style>
