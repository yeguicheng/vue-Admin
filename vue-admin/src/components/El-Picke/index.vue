<template>
	<div class="overflow-h">
		<el-row :gutter="10">
			<el-col :span="6" v-if="Setup.province">
				<el-select placeholder="请选择" v-model="datas.provinceValue" autocomplete="off" clearable @change="Chagnge_Province">
					<el-option v-for="item of datas.provinceData" :label="item.PROVINCE_NAME" :key="item.PROVINCE_CODE" :value="item.PROVINCE_CODE">
					</el-option>
				</el-select>
			</el-col>
			<el-col :span="6" v-if="Setup.choiced">
				<el-select placeholder="请选择" v-model="datas.cityValue" autocomplete="off" clearable @change="Chagnge_CityPicker">
					<el-option v-for="item of datas.cityData" :label="item.CITY_NAME" :value="item.CITY_CODE" :key="item.CITY_CODE"></el-option>
				</el-select>
			</el-col>

			<el-col :span="6" v-if="Setup.area">
				<el-select placeholder="请选择" v-model="datas.areaValue" autocomplete="off" clearable @change="Chagnge_AreaPicker">
					<el-option v-for="item of datas.areaData" :label="item.AREA_NAME" :value="item.AREA_CODE" :key="item.AREA_CODE"></el-option>
				</el-select>
			</el-col>
			<el-col :span="6" v-if="Setup.street">
				<el-select placeholder="请选择" v-model="datas.streetValue" autocomplete="off" clearable @change="Chagnge_Village">
					<el-option v-for="item of datas.streetData" :label="item.STREET_NAME" :value="item.STREET_CODE" :key="item.STREET_CODE"></el-option>
				</el-select>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import {
		ref,
		reactive,
		watch,
		toRefs,
		onBeforeMount,
		onMounted
	} from "@vue/composition-api"
	import {
		CityPicker
	} from "@/api/common.js"
	export default {
		name: "Picker",
		props: {
			// pickkerVal: String
			SetupOptions: {
				type: Array,
				default: () => []
			},
			resultData: {
				type: Object,
				default: () => {}
			}
		},
		// model: {
		// 	prop: "pickkerVal",
		// 	event: "pickkerMethod"
		// },
		setup(props, {
			root,
			emit
		}) {
			// 组件配置
			const Setup = reactive({})
			const {
				datas,
				resetData,
				reset_Deep_Data,
				ChoicedData,
				Chagnge_Province,
				Chagnge_CityPicker,
				Chagnge_AreaPicker,
				Chagnge_Village,
				Get_Province
			} = CityPicker();
			// methods
			const init = () => {
				const prop_data = props.SetupOptions;
				if (prop_data.length !== 0) {
					prop_data.forEach(item => Setup[item] = true)
				} else {
					const prop_data = ['province', 'choiced', 'area', 'street']
					let res = prop_data.map(item => Setup[item] = true)
				}
			}
			const initPicker = () => {
				const prop_resultData = props.resultData;
				for (const key in prop_resultData) {
					datas[key] = prop_resultData[key]
				}
			}
			// 重置地区
			const ResetPicker = () => {
				reset_Deep_Data()
			}
			// 监听
			watch([() => ChoicedData.provinceValue, () => ChoicedData.cityValue, () => ChoicedData.areaValue, () => ChoicedData.streetValue],
				([province, Choiced, area, street]) => {
					if (province != void 0 || Choiced != void 0 || area != void 0 || street != void 0) emit("update:resultData",
						ChoicedData)
				})
			// 生命周期
			onBeforeMount(async () => {
				init()
				await Get_Province()
				initPicker()
				console.log(props.resultData)
			})
			return {
				datas,
				Setup,
				ResetPicker,
				Chagnge_Province,
				Chagnge_CityPicker,
				Chagnge_AreaPicker,
				Chagnge_Village
			};
		}
	}
</script>

<style>
</style>
