<template>
	<div class="InfomationList">
		<el-row :gutter="14">
			<el-col :span="4">
				<div class="label-wrap category">
					<label for>分类:</label>
					<div class="warp-content">
						<el-select v-model="datas.Info_rmation.value" placeholder="请选择" style="width:100%">
							<el-option v-for="item of datas.options_CateGory" :key="item.id" :label="item.category_name" :value="item.id">
							</el-option>
						</el-select>
					</div>
				</div>
			</el-col>
			<el-col :span="7">
				<div class="label-wrap date">
					<label for>日期:</label>
					<div class="warp-content">
						<el-date-picker format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" v-model="datas.Info_rmation.value2"
						 type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['12:00:00', '08:00:00']"></el-date-picker>
					</div>
				</div>
			</el-col>
			<el-col :span="4">
				<div class="label-wrap key-word">
					<label for>关键字:</label>
					<div class="warp-content">
						<key-el-select :options="datas.options" v-model="datas.Info_rmation.KeyWord" @SelectMethod="_SelectMethod" />
						<!-- <el-select v-model="datas.Info_rmation.KeyWord" style="width:100%">
							<el-option v-for="items of datas.options2" :key="items.value" :label="items.label" :value="items.value"></el-option>
						</el-select> -->
					</div>
				</div>
			</el-col>
			<el-col :span="3">
				<el-input v-model="datas.Info_rmation.search_keyWord" placeholder="请输入关键字" style="width:100%"></el-input>
			</el-col>
			<el-col :span="2">
				<el-button type="danger" style="width:100%" size="medium" @click="Search">搜索</el-button>
			</el-col>
			<el-col :span="2" :push="2">
				<!-- 使用全局指令实现按钮权限设置 -->
				<!-- <el-button class="pull-right" type="danger" style="width:100%" size="medium" @click="datas.dialog_info = true" v-if="ButtonJurisdiction('info:add')">新增</el-button>-->
				<!-- 使用全局指令实现按钮权限设置 -->
				<el-button class="pull-right" type="danger" style="width:100%" size="medium" @click="datas.dialog_info = true"
				 v-ButtonJurisdiction="'info:add'">新增</el-button>
			</el-col>
		</el-row>
		<!-- 点位元素 -->
		<div class="black-space-30"></div>
		<!-- 表格数据 -->
		<el-table :data="datas.table_data" border style="width: 100%" v-loading="datas.loading" @selection-change="SeleceChange">
			<!-- 多选 -->
			<el-table-column type="selection" width="47"></el-table-column>
			<!-- 表格的表头 -->
			<el-table-column prop="title" label="标题" width="420" min-width="400"></el-table-column>
			<el-table-column prop="categoryId" label="类别" width="100" :formatter="toCategory"></el-table-column>
			<el-table-column prop="createDate" label="日期" :formatter="toDate" width="200"></el-table-column>
			<el-table-column prop="user" label="管理员" width="115"></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<!-- 使用全局方法实现按钮权限设置 -->
					<!-- <el-button type="danger" size="mini" @click="delete_item(scope.row.id)" v-ButtonJurisdiction="'info:edit'">自定义</el-button>
					<el-button type="danger" size="mini" @click="delete_item(scope.row.id)" v-if="ButtonJurisdiction('info:del')">删除</el-button>
					<el-button type="success" size="mini" @click="Info_Edit(scope.row.id)" v-if="ButtonJurisdiction('info:edit')">编辑</el-button> -->
					<!-- <router-link :to="{name:'infoDetails',params:{id:scope.row.id,title:scope.row.title}}" class="margin-left-10"> -->
					<!-- <el-button type="success" size="mini" @click="Info_Edit_Details(scope.row)" v-if="ButtonJurisdiction('info:detailed')">编辑详情</el-button> -->
					<!-- </router-link> -->
					<!-- 使用全局指令实现按钮权限设置 -->
					<el-button type="danger" size="mini" @click="delete_item(scope.row.id)" v-ButtonJurisdiction="'info:del'">删除</el-button>
					<el-button type="success" size="mini" @click="Info_Edit(scope.row.id)" v-ButtonJurisdiction="'info:edit'">编辑</el-button>
					<!-- <router-link :to="{name:'infoDetails',params:{id:scope.row.id,title:scope.row.title}}" class="margin-left-10"> -->
					<el-button type="success" size="mini" @click="Info_Edit_Details(scope.row)" v-ButtonJurisdiction="'info:detailed'">编辑详情</el-button>
					<!-- </router-link> -->
				</template>
			</el-table-column>
		</el-table>
		<!-- 点位元素 -->
		<div class="black-space-30"></div>
		<!-- 分页 -->
		<el-row>
			<el-col :span="12">
				<!-- 使用全局方法实现按钮权限设置 -->
				<el-button size="medium" @click="delete_all">批量删除</el-button>
				<!-- 使用全局指令实现按钮权限设置 -->
				<!-- <el-button size="medium" @click="delete_all" v-ButtonJurisdiction = "'info:batchDel'">批量删除</el-button> -->
			</el-col>
			<el-col :span="12">
				<el-pagination class="pull-right" :current-page="1" :page-size="5" @current-change="handle_currentChange"
				 background layout="total , prev, pager, next" :total="datas.total">
				</el-pagination>
			</el-col>
		</el-row>

		<!-- 新增对话框 -->
		<Dialog :flag.sync="datas.dialog_info" :category="datas.options_CateGory" />
		<!-- 编辑对话框 -->
		<Dialog-edit :flag.sync="datas.dialog_edit" :InfoId="datas.editId" :category="datas.options_CateGory" @getInfoList="API_infoList" />
	</div>
</template>
<script>
	import {
		transformationTime
	} from "@/utils/index.js"
	import Dialog from "./dialog/info";
	import DialogEdit from "./dialog/edit"
	// Vue3.0自定义全局方法
	import {
		global
	} from "@/utils/global_V3.0.js";
	import {
		InfoList,
		DeleteInfo
	} from "@/api/news.js";
	import {
		common
	} from "@/api/common.js";
	import {
		reactive,
		ref,
		watch,
		onMounted
	} from "@vue/composition-api";
	// 自封装的下拉列表
	import KeyElSelect from "@/components/El-Select"
	export default {
		name: "InfomationList",
		components: {
			Dialog,
			DialogEdit,
			KeyElSelect
		},
		setup(props, {
			root
		}) {
			const {
				str: aaa,
				confirm
			} = global();
			const {
				Get_Category: Get_Category_All,
				Category_data
			} = common();
			// watch(() => console.log(aaa.value), (Startval, Beforeprev) => {

			// })
			/*ref */
			/*reactive*/
			const datas = reactive({
				SelectVal: "",
				current_id: [], //分类id
				dialog_info: false, //弹窗中的开关状态
				dialog_edit: false,
				editId: null,
				loading: false, //表单加载状态
				options_CateGory: [], //分类选项中的数据
				options: ["id", "title"], //关键字选项中的数据
				Info_rmation: {
					value: "",
					value2: "",
					KeyWord: "id",
					search_keyWord: ""
				},
				table_data: [], //表格数据
				total: 0, // 表格页码总数
				pages: { // 当前页码与总数
					pageNumber: 1,
					pageSize: 5
				}
			})
			/*methods*/
			// 表单格式化属性
			// 编辑时
			const Info_Edit = id => {
				datas.editId = id;
				// 开启编辑对话框
				datas.dialog_edit = true;
			}
			// 编辑详情时
			const Info_Edit_Details = ({
				id
			}) => {
				// 不建议用这种方式在跳转时传值，除非数量比较多时
				// root.$store.commit("InfoDetails/Updates", {
				// 	Info_id: {
				// 		value: id,
				// 		isSession: true
				// 	},
				// 	Info_title: {
				// 		value: title,
				// 		isSession: true
				// 	}
				// })
				// 开启编辑对话框
				root.$router.push({
					path: `/infoDetails/${id}`,
				})
				// root.$router.push({
				// 	name: "infoDetails",
				// 	params: {
				// 		id,
				// 		title
				// 	}
				// })
			}
			const toDate = (row, column, cellValue, index) => {
				return transformationTime(row.createDate)
			}
			const toCategory = (row) => {
				let res = datas.options_CateGory.filter(items => items.id == row.categoryId);
				if (res.length === 0) {
					return false;
				}
				return res[0].category_name;
			}
			// 当点击某个页码时触发
			const handle_currentChange = val => {
				datas.pages.pageNumber = val;
				API_infoList();
			};
			// 自定义回调函数(删除单个)
			const CallBack_deleteInfo = async Infoid => {
				let id = [Infoid]
				await DeleteInfo({
					id
				})
				// 信息列表
				API_infoList();
			}
			// 自定义回调函数(批量删除)
			const Callback_deleteInfoAll = async Infoid => {
				let id = [...Infoid]
				await DeleteInfo({
					id
				})
				// 重置
				datas.current_id = []
				// 信息列表
				API_infoList();
			}
			// 删除单个
			const delete_item = (row_id) => {
				confirm({
					content: "确定删除该信息吗？删除后将无法恢复!",
					id: row_id,
					type: "warning",
					tip: "警告",
					fn: CallBack_deleteInfo
				})
			}
			// 点击批量中的某个时触发
			const SeleceChange = (selection) => {
				datas.current_id = selection.map(items => items.id)
			}
			// 批量删除
			const delete_all = () => {
				if (datas.current_id.length == 0 || datas.current_id == "") {
					root.$message({
						message: "请选择要删除的选项!",
						type: "warning"
					})
					return false;
				}
				confirm({
					content: "确定删除多条信息吗？删除后将无法恢复!",
					type: "warning",
					tip: "警告",
					id: datas.current_id,
					fn: Callback_deleteInfoAll
				})
			}
			// 获取信息列表
			const API_infoList = async () => {
				let params = FormData();
				// 加载状态
				datas.loading = true;
				let {
					data
				} = await InfoList(params);
				if (data.resCode === 0) {
					datas.table_data = data.data.data;
					datas.total = data.data.total;
					datas.loading = false;
				} else {
					datas.loading = false;
				}
			}
			// 搜索时需要的数据
			const FormData = () => {
				let params = {
					pageNumber: datas.pages.pageNumber,
					pageSize: datas.pages.pageSize,
				}
				//分类Id
				if (datas.Info_rmation.value) {
					params.categoryId = datas.Info_rmation.value
				}
				// 日期
				if (datas.Info_rmation.value2 && datas.Info_rmation.value2.length) {
					params.startTiem = datas.Info_rmation.value2[0];
					params.endTime = datas.Info_rmation.value2[1];
				}
				// 关键字
				if (datas.Info_rmation.KeyWord && datas.Info_rmation.search_keyWord) {
					// 接口需要的键值对
					params[datas.Info_rmation.KeyWord] = datas.Info_rmation.search_keyWord;
				}
				return params;

			}
			// 搜索
			const Search = () => {
				API_infoList()
			}
			// 分类Select中的Change事件
			const _CatgorySelectMethod = (resVal) => {
				// datas.Info_rmation.value
				console.log("model事件!", resVal)
			}
			// Select中的change事件
			const _SelectMethod = (resVal) => {
				datas.Info_rmation.KeyWord = resVal;
				// console.log("model事件!", datas.Info_rmation.KeyWord)
			}
			// watch监听器
			watch(() => Category_data.Category, (value) => {
				(value.length !== 0) && (datas.options_CateGory = value);
			})
			// 生命周期
			onMounted(() => {
				Get_Category_All()
				// 信息列表
				API_infoList();
				root.$store.dispatch("GetCategory");

			})
			return {
				/*ref */
				/*methods */
				handle_currentChange,
				delete_item,
				delete_all,
				toDate,
				toCategory,
				API_infoList,
				SeleceChange,
				Search,
				Info_Edit,
				Info_Edit_Details,
				_SelectMethod,
				_CatgorySelectMethod,
				/* reactive */
				datas,
			};
		}
	};
</script>
<style lang="scss">
	@import "../../../styles/config.scss";

	.label-wrap {
		&.category {
			@include labelDom(left, 60, 40);
		}

		&.date {
			@include labelDom(center, 93, 40);
		}

		&.key-word {
			@include labelDom(center, 99, 40);
		}
	}

	// 按钮权限元素
	.Button-Show {
		display: inline-block;
	}

	.Button-hidden {
		display: none;
	}
</style>
