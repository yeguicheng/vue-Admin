<template>
	<el-dialog width="33%" title="新增" :visible.sync="dialogState" @close="close" @opened="opened_Dialog">
		<el-form :model="Dialog_form" ref="Dialog_form">
			<el-form-item label="类型" :label-width="formLabelWidth" prop="optionId">
				<el-select v-model="Dialog_form.optionId" placeholder="请选择">
					<el-option v-for="item of Category_options.items" :label="item.category_name" :value="item.id" :key="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="标题" :label-width="formLabelWidth" prop="title">
				<el-input placeholder="请输入内容" v-model="Dialog_form.title" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="概况" :label-width="formLabelWidth" prop="content">
				<el-input type="textarea" :rows="3" v-model="Dialog_form.content" autocomplete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="close('Dialog_form')">取 消</el-button>
			<el-button type="danger" @click="determine('Dialog_form')" :loading="determine_load">确 定</el-button>
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
		InfoList
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
			/* reactive */
			const Dialog_form = reactive({
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
				Dialog_form.title = null;
				Dialog_form.optionId = null;
				Dialog_form.content = null;
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
			}
			// 新增信息接口
			const API_Addinfo = async (params, refname) => {
				let {
					data
				} = await Addinfo(params)
				let message = data.message
				if (data.resCode === 0) {
					root.$message({
						message,
						type: "success"
					})
					// 执行父组件的方法更新信息列表
					parent.API_infoList()
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
					category: Dialog_form.optionId,
					title: Dialog_form.title,
					content: Dialog_form.content
				}
				API_Addinfo(params, ref_from)
				// dialogFormVisible = false
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
				Dialog_form,
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
