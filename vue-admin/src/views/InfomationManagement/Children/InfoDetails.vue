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
				<El-upload :imageUrl.sync="InfoDateiForm.imageUrl" :configs="datas.configs" />
				<!-- <el-upload class="avatar-uploader" action="http://up-z2.qiniup.com" :data="datas.uploadKey" :show-file-list="false"
				 :on-error="handleAvatarError" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
					<img v-if="InfoDateiForm.imageUrl" :src="InfoDateiForm.imageUrl" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload> -->
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
		EditInfo,
		QiniuToken
	} from "@/api/news.js"
	// 富文本编辑器
	import {
		quillEditor
	} from 'vue-quill-editor'
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'
	// 缩略图
	import ElUpload from "@/components/EL-Upload"
	export default {
		components: {
			quillEditor,
			ElUpload
		},
		setup(props, {
			root
		}) {
			const {
				Get_Category: Get_CategoryAll,
				Category_data
			} = common()
			const datas = reactive({
				// 缩略图组件配置
				configs: {
					action: "http://up-z2.qiniup.com"
				},
				// 当前详情页面的信息id
				Info_id: root.$route.params.id,
				// 当前详情页面的下拉菜单数据（全部分类）
				Category_data: [],
				// 富文本的配置
				editorOption: {},
				// 保存按钮的加载效果
				save_loading: false,
			})
			// 表单数据
			let InfoDateiForm = reactive({
				CategoryId: "",
				title: "",
				createDate: "",
				content: "",
				imageUrl: ""
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
					root.$set(InfoDateiForm, "imageUrl", res.imgUrl)
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
					imgUrl: InfoDateiForm.imageUrl
				}
				API_EditInfo(params)
			}
			watch(() => Category_data.Category, (value) => {
				(value.length !== 0) && (datas.Category_data = value)
			})
			onMounted(() => {
				// 获取信息分类列表
				Get_CategoryAll()
				// 获取某个信息的详情数据
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
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>
