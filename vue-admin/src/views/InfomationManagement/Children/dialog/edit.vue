<template>
	<el-dialog width="33%" title="编辑" :visible.sync="dialogState" @close="close" @opened="opened_Dialog">
		<el-form :model="Edit_Dialog_form" ref="Edit_Dialog_form">
			<el-form-item label="类别" :label-width="formLabelWidth" prop="optionId">
				<el-select v-model="Edit_Dialog_form.optionId" placeholder="请选择" clearable>
					<el-option v-for="item of Category_options.items" :label="item.category_name" :value="item.id" :key="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="标题" :label-width="formLabelWidth" prop="title">
				<el-input placeholder="请输入内容" v-model="Edit_Dialog_form.title" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="内容" :label-width="formLabelWidth" prop="content">
				<el-input type="textarea" :rows="3" v-model="Edit_Dialog_form.content" autocomplete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="close('Edit_Dialog_form')">取 消</el-button>
			<el-button type="danger" @click="determine('Edit_Dialog_form')" :loading="determine_load">确 定</el-button>
		</div>
	</el-dialog>
</template>
<script>
	import {
		ref,
		reactive,
		watch
	} from "@vue/composition-api";
	import {
		Addinfo,
		InfoList,
		EditInfo
	} from "@/api/news.js"
	export default {
		name: "info",
		props: {
			flag: {
				type: Boolean,
				default: false
			},
			category: {
				type: Array,
				default: () => []
			},
			InfoId: {
				type: String,
				default: ""
			}
		},
		setup(props, {
			root,
			emit,
			refs,
			parent
		}) {
			/* ref */
			const dialogState = ref(false);
			const formLabelWidth = ref("40px");
			const determine_load = ref(false);
			const categoryId = ref("");
			/* reactive */
			const Edit_Dialog_form = reactive({
				title: "",
				optionId: "",
				content: ""
			});
			const Category_options = reactive({
				items: []
			})
			/* methods */
			//重置表单
			const resetForm = () => {
				Edit_Dialog_form.title = null;
				Edit_Dialog_form.optionId = null;
				Edit_Dialog_form.content = null;
			}
			const close = refname => {
				// 重置表单
				resetForm();
				// this.$emit 等同于= vue3.0中的 emit
				emit("update:flag", false);
				return;
			};
			// 打开弹窗动画时触发
			const opened_Dialog = () => {
				Category_options.items = props.category;
				InfoDetails(props.InfoId)
			}
			// 获取某个信息的详情数据
			const InfoDetails = async infoId => {
				const params = {
					id: infoId,
					pageNumber: 1,
					pageSize: 1
				}
				let {
					data
				} = await InfoList(params);
				if (data.resCode === 0) {
					const resData = data.data.data[0]
					categoryId.value = resData.categoryId;
					root.$set(Edit_Dialog_form, "title", resData.title)
					root.$set(Edit_Dialog_form, "optionId", resData.categoryId)
					root.$set(Edit_Dialog_form, "content", resData.content)
				} else {
					console.log("获取接口数据失败:", data)
				}
			}
			// 匹配信息的类型
			const matchingCategory = (id) => {
				return Category_options.items.find(items => items.id === id);
			}
			// 编辑信息接口
			const API_Editinfo = async (params, refname) => {
				let {
					data
				} = await EditInfo(params)
				let message = data.message
				if (data.resCode === 0) {
					root.$message({
						message,
						type: "success"
					})
					/*方法1*/
					// 执行父组件的方法更新信息列表
					// parent.API_infoList()
					/*方法2*/
					// 通过回调函数
					emit("getInfoList")
					// 重置表单
					refs[refname].resetFields();
				} else {
					root.$message({
						message,
						type: "error"
					})
				}
				determine_load.value = false;
			}
			// 确定时
			const determine = (ref_from) => {
				determine_load.value = true;
				let params = {
					id: props.InfoId,
					categoryId: Edit_Dialog_form.optionId,
					title: Edit_Dialog_form.title,
					content: Edit_Dialog_form.content,
					imgUrl: ""
				}
				API_Editinfo(params, ref_from)
			}
			// watch
			watch(
				() => {
					return (dialogState.value = props.flag);
				},
				(Startval, Beforeprev) => {}
			);
			return {
				/* ref */
				dialogState,
				formLabelWidth,
				determine_load,
				/* reactive */
				Edit_Dialog_form,
				Category_options,
				/* methods */
				close,
				opened_Dialog,
				determine
			};
		}
		// watch: {
		//   flag: {
		//     handler(newVal, oldVal) {
		//       console.log(this.dialogState);
		//       this.dialogState = newVal;
		//     },
		//     immediate: true
		//   }
		// }
		// methods: {
		//   close() {
		//     // 触发父组件事件
		//     // 方法1vue2.4之前
		//     // this.$emit("Emitclose", false);
		//     // 方法2vue2.4以后.好处：不用再在父类定义方法
		//     this.$emit("update:flag", false);
		//   }
		// }
	};
</script>
<style lang="scss" scoped>
</style>
