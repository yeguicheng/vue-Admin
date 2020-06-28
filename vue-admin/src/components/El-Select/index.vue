<template>
	<el-select v-model="datas.SelectVal" placeholder="请选择">
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
		props: {
			options: {
				type: Object,
				default: () => {}
			}
		},
		setup(props, {
			root
		}) {
			const datas = reactive({
				SelectVal: "",
				SelectData: [],
				Data_Origin: [{
						value: 'name',
						label: '姓名'
					}, {
						value: 'phon',
						label: '手机号'
					}, {
						value: 'email',
						label: '电子邮箱'
					}, {
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
				if (!props.options || props.options.values.length === 0) {
					console.log(props.options)
					console.warn("Warning：props options cannot be empty!");
					// throw ("Warning：props options cannot be empty!");
					return false
				}
				props.options.values.forEach(items => {
					const res = datas.Data_Origin.find(vals => vals.value === items);
					res && AfterVal.push(res);
				})
				datas.SelectData = AfterVal;
			}
			// 生命周期
			onMounted(() => {
				Filter()
			})
			return {
				datas
			}
		}
	}
</script>

<style>
</style>
