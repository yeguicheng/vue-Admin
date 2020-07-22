<template>
	<div id="layoutMain">
		<div class="main-content">
			<div class="content">
				<!-- 如果路由中的meta存在“keepAlive”,则进行路由缓存 -->
				<keep-alive>
					<router-view v-if="$route.meta && $route.meta.keepAlive" />
				</keep-alive>
				<!-- 如果路由中的meta不存在“keepAlive”,则进行路由显示 -->
				<router-view v-if="!($route.meta && $route.meta.keepAlive)" />
			</div>
		</div>
	</div>
</template>
<script>
</script>
<style lang="scss" scoped>
	@import "../../../styles/config.scss";

	#layoutMain {
		margin-top: 70px;
		height: 90vh;
		margin-left: $navMenu;
		@include webkit(transition, all 0.5s ease 0s);

		border: 30px solid #f6f6f6 {
			bottom: 0;
		}

		box-sizing: border-box;
	}

	.open {
		#layoutMain {
			left: $navMenu;
		}
	}

	.close {
		#layoutMain {
			margin-left: $left;
		}
	}

	.main-content {
		width: 100%;
		height: 100%;
		padding: 30px 30px 0 30px;
		// background: #f7f7f7;
		box-sizing: border-box;
	}

	// .content {
	//   width: 100%;
	//   height: 100%;
	//   background: #fff;
	//   box-sizing: border-box;
	// }
</style>
