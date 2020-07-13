<template>
	<div>
		A组件{{text}}
		<B v-bind="$attrs" v-on="$listeners" />
	</div>
</template>

<script>
	import B from "./B.vue"
	import {
		reactive
	} from "@vue/composition-api"
	export default {
		components: {
			B
		},
		setup(props, {
			attrs,
			emit
		}) {
			// console.log($listeners)
			// emit("updass")
			const text = reactive(attrs)
			console.log(text)
			return {
				text
			}
		}
	}
</script>

<style>
</style>
