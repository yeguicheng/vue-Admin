<template>
	<div id="InfoClass">
		<el-button type="danger" size="small" @click="AddClassification({types:'category_first_add'})">添加一级分类</el-button>
		<hr class="line_60" />
		<div>
			<el-row :gutter="5">
				<el-col :span="8">
					<template v-for="(items,ind) of category.item">
						<div class="category" :key="items.id">
							<!-- 一级分类 -->
							<h4>
								<SvgIcon IconName="put" IconClass="put"></SvgIcon>
								<!-- 一级分类名称 -->
								{{items.category_name}}
								<div class="button_group">
									<el-button size="mini" type="danger" @click="editItem({category_edit:items,types:'category_first_edit'})"
									 round>编辑</el-button>
									<el-button size="mini" type="success" round @click="AddClassChild({child_category_Add:items,types:'category_child_add'})">添加子级</el-button>
									<el-button size="mini" round @click="delectCategory(items.id,ind)">删除</el-button>
								</div>
							</h4>
							<!-- 二级分类 -->
							<ul v-if="items.children">
								<template v-for="(vals,child_ind) of items.children">
									<li :key="vals.id">
										<!-- 二级分类名称 -->
										{{vals.category_name}}
										<div class="button_group">
											<!-- vals.id,ind,vals -->
											<el-button size="mini" type="danger" round @click="edit_child_category({child_category_edit:vals,filst_category_items:items,filst_category_id:items.id,types:'child_category_edit'})">编辑</el-button>
											<el-button size="mini" round @click="Delete_child_category(vals.id,ind)">删除</el-button>
										</div>
									</li>
								</template>
							</ul>
						</div>
					</template>
				</el-col>
				<el-col :span="16">
					<h4 class="category_edit">一级分类编辑</h4>
					<!-- 表单 -->
					<el-form ref="formLabelAlign" :model="formLabelAlign" status-icon :rules="formLabelAlign_rules" label-position="right"
					 label-width="142px" class="form-wrap">
						<el-form-item label="一级分类名称：" v-if="Classification_one" prop="Name">
							<el-input v-model="formLabelAlign.Name" placeholder="请填写名称,不能使用纯数字" :disabled="Classification_one_disabled"></el-input>
						</el-form-item>
						<el-form-item label="二级分类名称：" v-if="Classification_child" prop="region">
							<el-input v-model="formLabelAlign.region" placeholder="请填写名称,不能使用纯数字" :disabled="Classification_child_disabled"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="danger" @click="submitForm('formLabelAlign')" :loading="loadingStatus" :disabled="Buttom_disabled">确定</el-button>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
		</div>
	</div>
</template>
<script>
	import {
		AddFirstCategory,
		Delete_category,
		Edit_category,
		AddChildCategory
	} from "@/api/news.js";
	import {
		reactive,
		ref,
		onMounted,
		watch
	} from "@vue/composition-api";
	import {
		VeriTitle
	} from "@/utils/index.js";
	import {
		global
	} from "@/utils/global_V3.0.js"
	import {
		common
	} from "@/api/common.js"
	export default {
		name: "InfoClass",
		setup(props, {
			root,
			refs
		}) {
			// res
			/*一级分类*/
			const Classification_one = ref(true);
			const Classification_one_disabled = ref(true);
			/*二级分类*/
			const Classification_child = ref(true);
			const Classification_child_disabled = ref(true);
			/*按钮状态*/
			const loadingStatus = ref(false);
			const Buttom_disabled = ref(true);
			// 添加与编辑的标记
			const Category_flag = ref("")
			// 全局自定义方法（提示方法）
			const {
				confirm: TipsMessage
			} = global()
			const {
				Get_Category: Get_Category_All,
				Category_data
			} = common()
			// reactive
			const formLabelAlign = reactive({
				Name: "",
				region: "",
				type: ""
			});
			/*分类接口数据*/
			const category = reactive({
				item: [],
				current_edit: {}
			})
			// methods
			// 添加一级分类接口
			const API_AddFirstCategory = async () => {
				const {
					Name
				} = formLabelAlign;
				let res = await AddFirstCategory({
					categoryName: Name
				});
				let message = res.data.message;
				if (res.data.resCode === 0) {
					// 请求成功后将请求的数据拼接到原数组中（相当于模拟再次请求接口）
					category.item = category.item.concat(res.data.data);
					root.$message({
						message,
						type: "success"
					});

				} else {
					root.$message({
						message,
						type: "warning"
					});
				}
			};
			// 添加二级分类接口
			const API_AddChildCategory = async () => {
				const {
					region,
				} = formLabelAlign;
				let res = await AddChildCategory({
					categoryName: region,
					parentId: category.current_edit.id
				})
				const message = res.data.message;
				if (res.data.resCode === 0) {
					// 请求成功后将请求的数据拼接到原数组中（相当于模拟再次请求接口）
					let index = category.item.findIndex(items => items.id === category.current_edit.id);
					// category.item[index].children && (category.item[index].children.push(res.data.data))||(category.item[index]."children" = [res.data.data])
					if (category.item[index].children) {
						category.item[index].children.push(res.data.data)
					} else {
						//要这样修改对象类型的数据（响应式的修改）
						root.$set(category.item[index], "children", [res.data.data])
						//不能这样修改对象类型的数据（不是响应式的修改）
						// category.item[index]["children"] = [res.data.data]
					}
					root.$message({
						message,
						type: "success"
					});
				} else {
					root.$message({
						message,
						type: "warning"
					});
				}
			}
			// 编辑一级分类接口
			const API_Edit_Category = async () => {
				// 没有点击编辑而是直接点击提交时
				if (category.current_edit.length == 0) {
					root.$message({
						message: "未选择分类!请选择",
						type: "error"
					})
					return;
				}
				let params = {
					id: category.current_edit.id,
					categoryName: formLabelAlign.Name,
				}
				let res = await Edit_category(params);
				let message = res.data.message;
				if (res.data.resCode === 0) {
					let response_data = res.data.data.data;
					let obj = {
						category_name: response_data.categoryName,
						id: category.current_edit.id
					}
					// 方法1
					// category.current_edit.category_name = obj.category_name
					let ind = category.item.findIndex(items => items.id == category.current_edit.id);
					category.item.splice(ind, 1, obj)
					root.$message({
						message,
						type: "success"
					})
				} else {
					root.$message({
						message,
						type: "warning"
					})
				}
				// 重置数据
				formLabelAlign.Name = null;
				category.current_edit = {};
			}
			// 编辑二级分类接口
			const API_Edit_Child_Category = async () => {
				// 没有点击编辑而是直接点击提交时
				// if (category.current_edit.length == 0) {
				// 	root.$message({
				// 		message: "未选择分类!请选择",
				// 		type: "error"
				// 	})
				// 	return;
				// }
				let params = {
					id: category.current_edit.id,
					categoryName: formLabelAlign.region,
				}
				let res = await Edit_category(params);
				let message = res.data.message;
				if (res.data.resCode === 0) {
					// 修改时输入的内容
					let response_data = res.data.data.data;
					let obj = {
						category_name: response_data.categoryName,
						id: category.current_edit.id
					}
					// 方法1
					// category.current_edit.category_name = obj.category_name
					// 找一级分类的下标
					let filst_ind = category.item.findIndex(items => items.id === category.current_edit.parent_id);
					// 找二级分类的下标
					let child_ind = category.item[filst_ind].children.findIndex(items => items.id == category.current_edit.id);
					category.item[filst_ind].children.splice(child_ind, 1, obj)
					root.$message({
						message,
						type: "success"
					})
				} else {
					root.$message({
						message,
						type: "warning"
					})
				}
				// 重置数据
				formLabelAlign.Name = null;
				category.current_edit = {};
			}
			// 确定按钮
			const submitForm = (formName) => {
				refs[formName].validate(valid => {
					if (valid) {
						loadingStatus.value = true;
						if (Category_flag.value === "category_first_add") {
							// 添加一级分类
							API_AddFirstCategory();
						} else if (Category_flag.value === "category_first_edit") {
							// 编辑一级分类
							API_Edit_Category()
						} else if (Category_flag.value === "category_child_add") {
							// 添加二级分类
							API_AddChildCategory();
						} else if (Category_flag.value === "child_category_edit") {
							// 编辑二级分类
							API_Edit_Child_Category()
						}
						// 重置表单
						refs[formName].resetFields();
						loadingStatus.value = false;
					} else {
						root.$message({
							message: "提交失败!请检查选项正确再重新提交",
							type: "error"
						})

						return false;
					}
				});
			};
			// 添加一级分类状态方法
			const AddClassification = (items) => {
				/*二级分类状态*/
				Classification_child.value = false;
				// 一级分类的状态
				Classification_one_disabled.value = false;
				// 把确定按钮的 “禁用” 状态关闭	
				Buttom_disabled.value = false;
				// 添加一级分类中标志
				Category_flag.value = items.types
			};
			// 添加二级分类状态
			const AddClassChild = (items) => {
				// 获取当前添加对象的数据
				category.current_edit = items.child_category_Add;
				// 添加二级分类中标志
				Category_flag.value = items.types
				// 把一级分类的内容显示
				formLabelAlign.Name = category.current_edit.category_name
				// 把二级分类的“禁用”状态关闭
				Classification_child_disabled.value = false;
				// 把确定按钮的“禁用”状态关闭	
				Buttom_disabled.value = false;
			}
			// 验证规则函数
			const NameRules = (rule, value, callback) => {
				if (!value) {
					callback(new Error("一级分类不能为空!"))
				} else if (!VeriTitle(value)) {
					callback(new Error("一级分类格式不正确,请使用中文开头!"))
				} else {
					callback();
				}
			};
			const RegionRules = (rule, value, callback) => {
				if (!value) {
					callback(new Error("二级分类不能为空!"))
				} else if (!VeriTitle(value)) {
					callback(new Error("二级分类格式不正确。请使用中文开头!"))
				} else {
					callback();
				}
			};
			const formLabelAlign_rules = reactive({
				Name: [{
					required: true,
					validator: NameRules,
					trigger: "blur"
				}],
				region: [{
					required: true,
					validator: RegionRules,
					message: "",
					trigger: "blur"
				}]
			})
			// 删除一级分类
			const delectCategory = (category_id, category_ind) => {
				TipsMessage({
					content: "确定删除该分类吗?删除后将无法恢复",
					tip: "警告!",
					id: category_id,
					ind: category_ind,
					fn: delete_tips,
					catchFn: () => {
						console.log("取消了!");
					}
				})
			}
			// 删除二级分类
			const Delete_child_category = (child_category_id, filst_category_ind) => {
				TipsMessage({
					content: "确定删除该分类吗?删除后将无法恢复",
					tip: "警告!",
					id: child_category_id,
					ind: filst_category_ind,
					fn: delete_child_tips,
					catchFn: () => {
						console.log("取消了!");
					}
				})
			}
			// 编辑一级分类
			const editItem = (items) => {
				// 将当前要编辑的数据显示回表单中
				formLabelAlign.Name = items.category_edit.category_name;
				// 编辑一级分类中标志
				Category_flag.value = items.types
				// 表单开启的状态
				Classification_one_disabled.value = false;
				Classification_child.value = false;
				Buttom_disabled.value = false;
				// 获取当前编辑对象的数据
				category.current_edit = items.category_edit;
			}
			// 编辑二级分类  child_category_id, filst_category_ind, child_category_items
			const edit_child_category = (items) => {
				// 将当前一级分类的数据回显到对应的表单中
				formLabelAlign.Name = items.filst_category_items.category_name
				// 将当前要编辑的数据显示回表单中
				formLabelAlign.region = items.child_category_edit.category_name;
				// 编辑二级分类中标志
				Category_flag.value = items.types
				// 表单开启的状态
				Classification_child_disabled.value = false;
				Buttom_disabled.value = false;
				// Classification_child.value = false;
				// 获取当前编辑对象的数据
				category.current_edit = items.child_category_edit;
				category.current_edit["parent_id"] = category.current_edit.parent_id ? category.current_edit.parent_id :
					items.filst_category_id.toString();
			}
			// 删除一级分类的自定义回调函数
			const delete_tips = async (id, ind) => {
				let res = await Delete_category({
					categoryId: id
				});
				if (res.data.resCode === 0) {
					// 方法1：通过参数拿到索引值
					// category.item.splice(ind, 1)
					// 方法2：通过es6的findIndex()
					let Category_id = category.item.findIndex(item => item.id === id)
					category.item.splice(Category_id, 1)
				} else {

				}

			}
			// 删除二级分类的自定义回调函数
			const delete_child_tips = async (child_id, filst_ind) => {
				let res = await Delete_category({
					categoryId: child_id
				});
				if (res.data.resCode === 0) {
					// 方法1：通过参数拿到索引值
					// category.item.splice(ind, 1)
					// 方法2：通过es6的findIndex()
					// 源数据
					const Origin_data = category.item;
					// “filst_ind”为一级分类的下标
					let Category_id = Origin_data[filst_ind].children.findIndex(item => item.id === child_id)
					Origin_data[filst_ind].children.splice(Category_id, 1)
				} else {
					console.log("删除失败：", res)
				}

			}
			// watch监听器
			watch(() => Category_data.Category, (value) => {
				(value.length !== 0) && (category.item = value);
			})
			// 生命周期
			onMounted(() => {
				// 本页信息分类接口
				Get_Category_All();
			})
			return {
				/* ref */
				Classification_one,
				Classification_one_disabled,
				Classification_child,
				Classification_child_disabled,
				loadingStatus,
				Buttom_disabled,
				/* reactive */
				formLabelAlign,
				formLabelAlign_rules,
				category,
				/* methods */
				submitForm,
				AddClassification,
				AddClassChild,
				delectCategory,
				Delete_child_category,
				editItem,
				edit_child_category
			};
		}
	};
</script>
<style lang="scss" scoped>
	// @import "../../../styles/config.scss";
	#InfoClass {
		button {
			font-size: 15px;
		}

		.line_60 {
			// css3中的计算属性函数
			width: calc(100% + 60px);
			// margin-left: -30px;
			margin: 30px 0 30px -30px;
			border: none;
			border-bottom: 1px solid #e9e9e9;
		}

		.category {
			line-height: 44px;
			position: relative;

			// 第一个
			&:first-of-type {
				&::before {
					top: 20px;
				}
			}

			// 最后一个
			&:last-of-type {
				&::before {
					bottom: 20px;
				}
			}

			&::before {
				content: "";
				position: absolute;
				left: 20px;
				// 如果用了定位并且把top与bottom同时设置为0，表示高度为其“相对定位”元素的高度
				top: 0;
				bottom: 0;
				border-left: 1px dotted #000000;
			}

			h4 {
				position: relative;
				padding-left: 40px;

				.put {
					position: absolute;
					bottom: 0;
					left: 12px;
					top: 14px;
					fill: currentColor;
					background: #fff;
					color: #000;
				}
			}

			li {
				padding-left: 38px;
				margin-left: 22px;
				position: relative;

				&::before {
					content: "";
					position: absolute;
					width: 32px;
					top: 22px;
					left: 0;
					border-bottom: 2px dotted #000000;
				}
			}

			// 鼠标经过时
			h4,
			li {
				@include webkit(transition, all 0.5s ease 0s);

				&:hover {
					.button_group {
						display: block;
					}

					cursor: pointer;
					background: #f3f3f3;
				}
			}
		}

		.category_edit {
			padding-left: 22px;
			line-height: 44px;
			background: #f3f3f3;
		}

		.button_group {
			display: none;
			position: absolute;
			right: 11px;
			top: -1px;

			button {
				font-size: 12px;
			}
		}
	}

	.form-wrap {
		width: 407px;
		padding-top: 26px;
	}
</style>
