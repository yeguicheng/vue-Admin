import {
	Post,
	Servers
} from '@/axiosRequest/index.js'

// 新增信息
export function Addinfo(data) {
	const url = "/news/add/";
	return Post(url, data)
}
// 获取信息列表
export function InfoList(data) {
	const url = "/news/getList/";
	return Post(url, data)
}
// 编辑信息
export function EditInfo(data) {
	const url = "/news/editInfo/";
	return Post(url, data);
}
// 删除信息
export function DeleteInfo(data) {
	const url = "/news/deleteInfo/";
	return Post(url, data)
}
// 新增信息分类添加一级
export function AddFirstCategory(data) {
	const url = '/news/addFirstCategory/'
	return Post(url, data)
}
// 新增信息分类添加子级
export function AddChildCategory(data) {
	const url = '/news/addChildrenCategory/'
	return Post(url, data)
}
// 获取分类的信息（无子级分类数据）
export function Get_Category(data) {
	const url = "/news/getCategory/";
	return Post(url, data)
}
// 获取分类的信息（有子级分类数据）
export function Get_Category_All(data) {
	const url = "/news/getCategoryAll/";
	return Post(url, data)
}
// 删除分类的信息
export function Delete_category(data) {
	const url = "/news/deleteCategory/";
	return Post(url, data)
}
// 编辑分类的信息
export function Edit_category(data) {
	const url = "/news/editCategory/";
	return Post(url, data);
}
// 二次封装的表单组件数据
export function loadData(paramsed) {
	return Servers({
		url: paramsed.url,
		method: paramsed.method || "post",
		data: paramsed.data || {},
		params: paramsed.params || {}
	})

}
