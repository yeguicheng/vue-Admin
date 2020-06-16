import {
	MessageBox,
	Message
} from 'element-ui';
export default {
	install(Vue, options) {
		Vue.prototype.confirm = (params) => {
			MessageBox.confirm(params.content, params.tip || '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: params.type || 'warning',
				center: true
			}).then(() => {
				params.fn()
				Message({
					type: 'success',
					message: '删除成功!'
				});
			}).catch(() => {
				Message({
					type: 'info',
					message: '已取消删除'
				});
			});
		}
	}
}
