<template>
	<el-dialog width="40%" title="新增" :visible.sync="datas.dialogFormVisible" @close="DialogClose" @open="DialogOpened">
		<el-form :model="datas.form" ref="AddValidateForm" :rules="datas.Add_User_Rules">
			<el-form-item label="用户名：" :label-width="datas.formLabelWidth" prop="username">
				<el-input v-model="datas.form.username" placeholder="请输入用户邮箱" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="密码：" :label-width="datas.formLabelWidth" prop="password">
				<el-input v-model="datas.form.password" type="password" placeholder="请输入密码" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="姓名：" :label-width="datas.formLabelWidth" prop="truename">
				<el-input v-model="datas.form.truename" placeholder="请输入姓名" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="手机号：" :label-width="datas.formLabelWidth" prop="phone">
				<el-input v-model.number="datas.form.phone" placeholder="请输入手机号" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="地区：" :label-width="datas.formLabelWidth" prop="region">
				<el-picker ref="Picker" :resultData.sync="datas.form.region" :SetupOptions="['province', 'choiced', 'area','street']" />
			</el-form-item>
			<el-form-item label="是否启用：" :label-width="datas.formLabelWidth" prop="status">
				<el-radio v-model="datas.form.status" label="1">禁用</el-radio>
				<el-radio v-model="datas.form.status" label="2">启用</el-radio>
			</el-form-item>
			<el-form-item label="角色：" :label-width="datas.formLabelWidth" prop="role">
				<el-checkbox-group v-model="datas.form.role">
					<el-checkbox v-for="item of datas.RoleData" :label="item.role" :key="item.role">{{item.name}}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="按钮权限：" :label-width="datas.formLabelWidth" prop="btnPerm">
				<div v-if="datas.btnPermData && datas.btnPermData.length !==0">
					<template v-for="items of datas.btnPermData">
						<h4>{{items.name}}</h4>
						<template v-if="items.perm && items.perm.length !==0">
							<el-checkbox-group v-model="datas.form.btnPerm">
								<el-checkbox v-for="vals of items.perm" :label="vals.value" :key="vals.value">{{vals.name}}</el-checkbox>
							</el-checkbox-group>
						</template>
					</template>
				</div>


			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="DialogClose">取 消</el-button>
			<el-button type="danger" @click="onSubmit('AddValidateForm')" :loading="datas.loading">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {
		ref,
		reactive,
		watch,
		toRefs,
		onMounted
	} from "@vue/composition-api"
	import {
		stripscript,
		VeriPhon,
		VeriEmail,
		VeriPaw
	} from "@/utils/index.js"
	import {
		GetSystem,
		GetRole,
		GetPermButton,
		UserAdd,
		UserEdit
	} from "@/api/user.js"
	import sha1 from "js-sha1";
	import elPicker from "@/components/El-Picke/index.vue"
	export default {
		name: "addUser",
		components: {
			elPicker
		},
		props: {
			flag: {
				type: Boolean,
				default: false
			},
			UserEdit: {
				type: Object,
				default: () => {}
			}
		},
		setup(props, {
			root,
			emit,
			refs,
			parent
		}) {
			const validateUserName = (rule, value, callback) => {
				if (value === "") {
					callback(new Error('请输入用户名'));
				} else {
					if (!VeriEmail(value)) {
						callback("输入的邮箱格式不正确，请重新输入！");
						return false;
					}
					callback();
				}
			}
			const validateFullName = (rule, value, callback) => {
				if (value === "") {
					callback(new Error('请输入姓名'));
				} else {
					datas.form.truename = stripscript(value);
					callback();
				}
			}
			const validatePassword = (rule, value, callback) => {
				/**
				 * @param {type}  
				 * 用户编辑时：
				 * 		验证密码：存在 “props.UserEdit.id”并且用户输入密码时
				 * 		不验证密码：存在 “props.UserEdit.id”并且用户没有输入密码时
				 * 用户添加时：
				 * 		验证密码：用户没有输入密码时
				 * **/
				// 存在 “props.UserEdit.id”并且用户没有输入密码时
				if (props.UserEdit.id && !value) callback();
				// 这里已经存在 “用户点击编辑” 或者 “用户点击添加”时两种情况的验证了
				if ((props.UserEdit.id && value) || !props.UserEdit.id) {
					if (value === "") {
						callback(new Error('请输入密码!'));
					} else if (!VeriPaw(value)) {
						callback(new Error('密码为6~20位数字+字母!'));
					} else {
						datas.form.password = stripscript(value);
						callback();
					}
				}
			}
			const validatePhon = (rule, value, callback) => {
				if (value === "") {
					callback(new Error('请输入手机号'));
				} else {
					if (!VeriPhon(value)) {
						callback("输入的号码格式不正确，请重新输入！");
						return false;
					}
					callback();
				}
			}
			const validateregion = (rule, value, callback) => {
				for (const key in value) {
					if (value[key] == void 0) {
						callback(new Error('请选择地区'))
					} else {
						callback();
					}
				}
			}
			const validateState = (rule, value, callback) => {
				if (value === "") {
					callback(new Error('请选择状态'));
				} else {
					callback();
				}
			}
			const validaterole = (rule, value, callback) => {
				if (value.length === 0) {
					callback(new Error('请给角色选择权限'));
				} else {
					callback();
				}
			}
			// reactive
			const datas = reactive({
				dialogFormVisible: false,
				formLabelWidth: "95px",
				loading: false,
				RoleData: [],
				btnPermData: [],
				form: {
					username: "",
					truename: "",
					password: "",
					status: '1',
					role: [],
					region: {},
					phone: '',
					btnPerm: []
				},
				Add_User_Rules: {
					username: [{
						required: true,
						validator: validateUserName,
						trigger: "blur"
					}],
					truename: [{
						validator: validateFullName,
						trigger: "blur"
					}],
					password: [{
						validator: validatePassword,
						trigger: "blur"
					}],
					phone: [{
						validator: validatePhon,
						trigger: "blur"
					}],
					region: [{
						required: true,
						validator: validateregion,
						trigger: "change"
					}],
					status: [{
						required: true,
						validator: validateState,
						trigger: "blur"
					}],
					role: [{
						required: true,
						validator: validaterole,
						trigger: "blur"
					}]
				}
			})
			// methods
			const DialogClose = () => {
				// 重置表单
				refs["AddValidateForm"].resetFields();
				refs["Picker"].ResetPicker()
				// 因为props传值是单向的（子组件不能改变父组件的数据），所以使用这种方法的作用是：即想改变父组件中的值，从而再监听父组件的值来改变子组件的值
				emit("update:flag", false)
			}
			const API_GetSystem = async () => {
				if (datas.RoleData.length === 0) {
					// 获取用户角色的权限接口
					const Role_Res = await GetRole();
					datas.RoleData = Role_Res.data.data;
				}

				if (datas.btnPermData.length === 0) {
					//  获取用户按钮权限列表接口
					const PermButton_Res = await GetPermButton();
					datas.btnPermData = PermButton_Res.data.data;
				}
				console.log(datas.btnPermData)
				// if ((Role_Res.data && Role_Res.data.resCode === 0) && PermButton_Res.data && PermButton_Res.data.resCode === 0) {
				// 	datas.RoleData = Role_Res.data.data;
				// 	datas.btnPerm = PermButton_Res.data.data;
				// 	console.log(datas.btnPerm)
				// } else {
				// 	throw Role_Res.data.message;
				// }

			}
			// 添加用户
			const API_UserAdd = async (params) => {
				let {
					data
				} = await UserAdd(params);
				if (data && data.resCode === 0) {
					// 重置表单
					refs["AddValidateForm"].resetFields();
					params.region = {}
					root.$message({
						message: data.message,
						type: "success"
					})
				} else {
					data && root.$message({
						message: data.message,
						type: "error"
					})
				}
				// 重置地区的选择记录
				refs["Picker"].ResetPicker()
				datas.loading = false;
			}
			// 编辑用户
			const API_UserEdit = async (params) => {
				let {
					data
				} = await UserEdit(params);
				if (data && data.resCode === 0) {
					// 重置表单
					refs["AddValidateForm"].resetFields();
					params.region = {}
					root.$message({
						message: data.message,
						type: "success"
					})
				} else {
					data && root.$message({
						message: data.message,
						type: "error"
					})
				}
				datas.loading = false;
			}
			// 窗口打开时
			const DialogOpened = () => {
				// 获取角色
				API_GetSystem()
				const editData = props.UserEdit;
				// 如果存在 “id”,则是编辑操作，否则是添加操作
				if (editData.id) {
					// 转数组
					editData.role = editData.role ? editData.role.split(",") : [];
					editData.btnPerm = editData.btnPerm ? editData.btnPerm.split(",") : [];
					// 转对象
					editData.region = JSON.parse(editData.region)
					for (const key in editData) {
						datas.form[key] = editData[key];
					}
					console.log(datas.form.btnPerm)
				} else {
					datas.form.id && delete datas.form.id;
					// 重置表单
					refs["AddValidateForm"] && refs["AddValidateForm"].resetFields();
				}
			}
			const onSubmit = (refName) => {
				refs[refName].validate(valid => {
					if (valid) {
						let params = JSON.parse(JSON.stringify(datas.form));
						// 将数组转为字符串
						params.role = params.role.join();
						params.btnPerm = params.btnPerm.join();
						// 将对象转为json字符串
						params.region = JSON.stringify(params.region)
						// 关闭窗口
						// datas.dialogFormVisible = false;
						// 开启按钮加载状态
						datas.loading = true;
						if (datas.form.id) { // 用户编辑状态
							params.password && (params.password = sha1(params.password)) || (delete params.password);
							API_UserEdit(params)
						} else { //用户添加状态
							params.password = sha1(params.password);
							API_UserAdd(params)
						}
						// 更新表格数据 refs.UesrTable.initTableData();
						// console.log("parent.$refs.UesrTable.initTableData：",parent.$refs.UesrTable.initTableData)
						parent.$refs.UesrTable.initTableData()
					} else {
						root.$message({
							message: "提交失败!请检查选项正确再重新提交",
							type: "error"
						})
						return false;
					}
				})
			}
			// watch
			// 监听父组件中的值
			watch(() => datas.dialogFormVisible = props.flag, (value1, value2) => {})
			return {
				datas,
				DialogClose,
				DialogOpened,
				onSubmit
			}
		}
	}
</script>

<style>
</style>
