import {
	MessageBox,
	Message
} from 'element-ui';
import {
	ref
} from "@vue/composition-api"
export function global() {
	const str = ref("");
	const confirm = (params) => {
		MessageBox.confirm(params.content, params.tip || '警告!', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: params.type || 'warning',
			center: true
		}).then(() => {
			str.value = "333"
			// 回调函数
			params.fn(params.id, params.ind)
			Message({
				type: 'success',
				message: params.message || '删除成功!'
			});
		}).catch(() => {
			Message({
				type: 'info',
				message: '已取消删除'
			});
		});
	}
	return {
		str,
		confirm
	}
}
