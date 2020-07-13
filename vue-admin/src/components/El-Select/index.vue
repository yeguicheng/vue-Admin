<template>
	<el-select clearable :value="SelectVal" placeholder="请选择" @change="updateVal" @clear="Cleared">
		<el-option v-for="item in datas.SelectData" :key="item.value" :label="item.label" :value="item.value">
		</el-option>
	</el-select>
</template>

<script>
	import {
		ref,
		reactive,
		onMounted
	} from "@vue/composition-api"
	export default {
		name: "El-Select",
		props: {
			options: {
				type: Array,
				default: () => []
			},
			key_word_selected: {
				type: Object,
				default: () => {}
			},
			SelectVal: String
		},
		model: {
			prop: "SelectVal",
			event: "SelectMethod"
		},
		setup(props, {
			root,
			emit
		}) {
			const datas = reactive({
				SelectVal: "",
				SelectData: [],
				Data_Origin: [{
						value: 'username',
						label: '姓名'
					},
					{
						value: 'phone',
						label: '手机号'
					},
					{
						value: 'email',
						label: '电子邮箱'
					},
					{
						value: "id",
						label: "ID"
					},
					{
						value: "title",
						label: "标题"
					}
				]
			})
			// 数据过滤
			const Filter = () => {
				let AfterVal = [];
				if (!props.options || props.options.length === 0) {
					console.log(props.options)
					console.warn("Warning：props options cannot be empty!");
					// throw ("Warning：props options cannot be empty!");
					return false
				}
				props.options.forEach(items => {
					const res = datas.Data_Origin.find(vals => vals.value === items);
					res && AfterVal.push(res);
				})
				datas.SelectData = AfterVal;
			}
			// 选择改变时
			const updateVal = (val) => {
				const filter_data = Object.assign(datas.Data_Origin);
				const res = filter_data.find(items => items.value === val);
				emit("update:key_word_selected", res)
				emit("SelectMethod", val)
			}
			// 点击清除图标时
			const Cleared = () => {
				console.log("测试")
			}
			// 生命周期
			onMounted(() => {
				Filter()
			})
			return {
				datas,
				updateVal,
				Cleared
			}
		}
	}
</script>

<style>
</style>
