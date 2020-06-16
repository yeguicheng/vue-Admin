<template>
	<svg :class="svgClass" aria-hidden="true">
		<use :xlink:href="Iconname" />
	</svg>
</template>
<script>
	import {
		ref,
		computed
	} from "@vue/composition-api";
	export default {
		name: "SvgIcon",
		// props: ["IconName", "IconClass"],
		props: {
			IconName: {
				type: String,
				default: "默认值"
			},
			IconClass: {
				type: String,
				default: "默认值"
			}
		},
		setup(props, context) {
			// 计算属性。并返回结果
			// 返回图标名字
			const Iconname = computed(() => `#icon-${props.IconName}`);
			// 返回类名
			const svgClass = computed(() => {
				// 如果地方法传入类名就追加
				if (props.IconClass) {
					return `svg-icon ${props.IconClass}`;
				} else {
					return `svg-icon`;
				}
			});
			return {
				Iconname,
				svgClass
			};
		}
	};
</script>
<style lang="scss" scoped>
	.svg-icon {
		width: 1em;
		height: 1em;
		fill: currentColor;
		color: #fff;
	}
</style>
