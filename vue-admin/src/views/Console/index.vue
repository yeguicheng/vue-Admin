<template>
	<div class="Console">控制台
		<div id="login_container"></div>
	</div>
</template>
<script>
	export default {
		//微信反码API
		mounted() {
			const self = this;
			const Script = document.createElement("script");
			Script.setAttribute("async", "");
			Script.setAttribute("charset", "UTF-8");
			Script.setAttribute("type", "text/javascript");
			Script.addEventListener("load", () => {
				console.log("加载Script标签")
				const WxApi = new WxLogin({
					self_redirect: false,
					id: "login_container",
					appid: "wxcb8e14282c58b5c3",
					scope: "snsapi_login",
					redirect_uri: "http://bd.hcity.com/callBack",
					state: 'A123DC35165464',
					style: "black",
					href: 'data:text/css;base64,LmltcG93ZXJCb3ggLm5vcm1hbFBhbmVse21hcmdpbi10b3A6IDE1cHg7fQouaW1wb3dlckJveCAucXJjb2RlIHt3aWR0aDogMjMwcHg7Ym9yZGVyLWNvbG9yOiNDNUUxRkY7fQouaW1wb3dlckJveCAudGl0bGUge2Rpc3BsYXk6IG5vbmU7fQ=='
				})
				// console.log(WxApi)
			});
			Script.addEventListener("error", () => {
				self.printError("Failed to load ")
			});
			Script.src = "http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js"
			let node = document.getElementsByTagName("script")[0]
			node.parentNode.insertBefore(Script, node);
		}
	}
</script>
<style scoped>

</style>
