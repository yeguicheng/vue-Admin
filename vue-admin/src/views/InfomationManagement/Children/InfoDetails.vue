<template>
	<div>
		<el-form :model="InfoDateiForm" :rules="InfoDateiForm" ref="InfoDateiForm" label-width="100px" class="demo-ruleForm">
			<el-form-item label="信息分类" prop="Category">
				<el-select v-model="InfoDateiForm.CategoryId" placeholder="请选择">
					<el-option :label="items.category_name" :value="items.id" v-for="items of datas.Category_data" :key="items.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="新闻标题" prop="title">
				<el-input v-model="InfoDateiForm.title"></el-input>
			</el-form-item>
			<el-form-item label="缩略图" required>
				缩略图
			</el-form-item>
			<el-form-item label="发布日期" prop="delivery">
				<el-date-picker disabled v-model="InfoDateiForm.createDate" type="date" placeholder="选择日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="详细内容" prop="desc">
				<quillEditor v-model="InfoDateiForm.content" ref="myQuillEditor" :options="datas.editorOption"></quillEditor>
				<!-- <el-input type="textarea" v-model="InfoDateiForm.content"></el-input> -->
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('InfoDateiForm')" :loading="datas.save_loading">保存</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import {
		ref,
		reactive,
		onMounted,
		watch
	} from "@vue/composition-api";
	import {
		transformationTime
	} from "@/utils/index.js"
	import {
		common
	} from "@/api/common.js"
	import {
		InfoList,
		EditInfo
	} from "@/api/news.js"
	// 富文本编辑器
	import {
		quillEditor
	} from 'vue-quill-editor'
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'
	export default {
		components: {
			quillEditor
		},
		setup(props, {
			root
		}) {
			const {
				Get_Category: Get_CategoryAll,
				Category_data
			} = common()
			const datas = reactive({
				// 当前详情页面的信息id
				Info_id: root.$route.params.id,
				// 当前详情页面的下拉菜单数据（全部分类）
				Category_data: [],
				// 富文本的配置
				editorOption: {},
				// 保存按钮的加载效果
				save_loading: false
			})
			let InfoDateiForm = reactive({
				CategoryId: "",
				title: "111",
				createDate: "",
				content: ""
			})
			// 获取某个信息的详情
			const API_InfoList = async id => {
				let params = {
					id,
					pageNumber: 1,
					pageSize: 1
				}
				let {
					data
				} = await InfoList(params)
				const res = data.data.data[0];
				if (data.resCode === 0) {
					root.$set(InfoDateiForm, "CategoryId", res.categoryId)
					root.$set(InfoDateiForm, "title", res.title)
					root.$set(InfoDateiForm, "createDate", transformationTime(res.createDate))
					root.$set(InfoDateiForm, "content", res.content)
					return false;
				}
			}
			// 编辑接口
			const API_EditInfo = async (params) => {
				let {
					data
				} = await EditInfo(params)
				const message = data.message
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
					// emit("getInfoList")
				} else {
					root.$message({
						message,
						type: "error"
					})
				}
				root.$set(datas, "save_loading", false)
			}
			// 保存时触发
			const submitForm = () => {
				datas.save_loading = true;
				let params = {
					id: datas.Info_id,
					categoryId: InfoDateiForm.CategoryId,
					title: InfoDateiForm.title,
					content: InfoDateiForm.content,
					imgUrl: ""
				}
				API_EditInfo(params)
			}
			watch(() => Category_data.Category, (value) => {
				(value.length !== 0) && (datas.Category_data = value)
			})
			onMounted(() => {
				Get_CategoryAll()
				API_InfoList(datas.Info_id)
			})
			return {
				InfoDateiForm,
				submitForm,
				datas
			}
		}
	}
</script>

<style>
</style>
