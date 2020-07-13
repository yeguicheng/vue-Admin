<template>
	<div>
		<el-upload class="avatar-uploader" :action="datas.action" :data="datas.uploadKey" :show-file-list="false" :on-error="handleAvatarError"
		 :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
			<img v-if="datas.imageUrl" :src="datas.imageUrl" class="avatar">
			<i v-else class="el-icon-plus avatar-uploader-icon"></i>
		</el-upload>
	</div>
</template>

<script>
	import {
		ref,
		reactive,
		onMounted,
		onBeforeMount,
		watch
	} from "@vue/composition-api"
	//获取七牛云token
	import {
		GetUploadToken
	} from "@/utils/GenToken/getToken.js"
	export default {
		name: "upload",
		props: {
			imageUrl: {
				type: String,
				default: ""
			},
			configs: {
				type: Object,
				default: () => {}
			}
		},
		setup(props, {
			root,
			emit
		}) {
			// reactive
			const datas = reactive({
				// 图片地址
				imageUrl: "",
				// 七牛云的存储区域
				action: "",
				// 上传的参数
				uploadKey: {
					token: "",
					key: ""
				}
			})
			// methods
			// 上传成功时
			const handleAvatarSuccess = (res, file) => {
				datas.imageUrl = `${root.$store.getters["GET_QINIU_URL"]}${res.key}`;
				emit("update:imageUrl", datas.imageUrl);
				console.log("file：", file)
				// this.imageUrl = URL.createObjectURL(file.raw);
			}
			// 上传失败时
			const handleAvatarError = (err, file, fileList) => {
				console.log("失败时err：", err)
				console.log("失败时file：", file)
				console.log("失败时fileList：", fileList)
			}
			// 上传之前的回调
			const beforeAvatarUpload = (file) => {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isJPG) {
					root.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					root.$message.error('上传头像图片大小不能超过 2MB!');
				}
				// 文件名转码
				const FileName = file.name;
				// const key = FileName;
				// const key = encodeURI(`${FileName}`);
				datas.uploadKey.key = FileName;
				return isJPG && isLt2M;
			}
			const Configed = () => {
				const Keys = Object.keys(datas)
				const configs = props.configs;
				for (const key in configs) {
					// 缩略图组件的配置数据
					Keys.includes(key) && (datas[key] = configs[key]);
				}
			}
			// 监听器
			watch(() => props.imageUrl, (vals) => {
				datas.imageUrl = vals;
			})
			// 生命周期
			onBeforeMount(() => {
				// 获取七牛云Token
				datas.uploadKey.token = GetUploadToken();
				// 缩略图组件的配置数据
				Configed()
			})
			return {
				datas,
				handleAvatarSuccess,
				handleAvatarError,
				beforeAvatarUpload
			}
		}
	}
</script>

<style>
</style>
