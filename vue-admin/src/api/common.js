import {
	Get_Category_All,
	cityPicker
} from "./news.js"
import {
	reactive,
	toRefs,
	watch
} from "@vue/composition-api"

export function common() {
	const Category_data = reactive({
		Category: []
	})
	//1: 外面要先调用这个接口，获取数据
	const Get_Category = async () => {
		let res = await Get_Category_All({});
		if (res.data.resCode === 0) {
			//2：储存数据 
			Category_data.Category = res.data.data
		}
	}
	return {
		Get_Category,
		// 返回这个数据
		Category_data
	}
}

// 城级联运
export function CityPicker() {
	const datas = reactive({
		provinceValue: null,
		provinceData: [],
		cityValue: null,
		cityData: [],
		areaValue: null,
		areaData: [],
		streetValue: null,
		streetData: []
	})
	/*获取选择后的数据*/
	const ChoicedData = reactive({
		provinceValue: null,
		cityValue: null,
		areaValue: null,
		streetValue: null
	})
	// 储存选择后的数据
	const resultData = () => {
		for (const key in ChoicedData) {
			ChoicedData[key] = datas[key]
		}
	}
	// 普通清除选择后的数据
	const resetData = () => {
		console.log("0000")
		for (const key in ChoicedData) {
			ChoicedData[key] = null
		}
	}
	// 深度清除数据
	const reset_Deep_Data = () => {
		console.log("0000")
		for (const key in ChoicedData) {
			datas[key] = null
		}
	}
	/*城级联运数据*/
	const API_CityPicker = async (params) => {
		const {
			data
		} = await cityPicker(params);
		if (data.resCode === 0) {
			return data.data.data;
		} else {
			throw data.message;
		}

	}
	/*获取省份数据*/
	const Get_Province = async () => {
		let res = await API_CityPicker({
			type: "province"
		})
		datas.provinceData = res;
	}
	/*省份改变时触发*/
	const Chagnge_Province = async (val) => {
		if (val) {
			reset({
				type: "province"
			})
			let res = await API_CityPicker({
				type: "city",
				province_code: val
			})
			// datas.cityValue = res[0]['CITY_NAME']
			datas.cityData = res;
		}

	}
	/*城市改变时触发*/
	const Chagnge_CityPicker = async (val) => {
		if (val) {
			reset({
				type: "city"
			})
			let res = await API_CityPicker({
				type: "area",
				city_code: val
			})
			datas.areaData = res;
		}
	}
	/*街道改变时触发*/
	const Chagnge_AreaPicker = async (val) => {
		if (val) {
			reset({
				type: "area"
			})
			let res = await API_CityPicker({
				type: "street",
				area_code: val
			})
			datas.streetData = res;
		}
	}
	/*村*/
	const Chagnge_Village = val => {
		if (val) {
			reset({
				type: ""
			})
		}
	}
	/*重置*/
	const reset = ({
		type
	}) => {
		const items = {
			province: ["cityValue", "areaValue", "streetValue"],
			city: ["areaValue", "streetValue"],
			area: ["streetValue"]
		}
		type && items[type].forEach(items => datas[items] = null);
		// 重置相当于在选择了
		resultData();
	}
	// 监听（多个）选项动作
	// watch([() => datas.provinceValue, () => datas.cityValue, () => datas.areaValue, () => datas.streetValue], ([province,
	// 	city, area, street
	// ]) => {
	// 	resultData()
	// })
	return {
		// ...toRefs(datas),
		datas,
		ChoicedData,
		Get_Province,
		Chagnge_Province,
		Chagnge_CityPicker,
		Chagnge_AreaPicker,
		Chagnge_Village,
		resetData,
		reset_Deep_Data
	}
}
