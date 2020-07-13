<template>
	<div>B组件{{text}}</div>
</template>

<script>
	import {reactive} from "@vue/composition-api"
	export default {
		setup(props, {attrs,emit}) {
			
			const text = reactive(attrs);
			emit("updass")
			return {
				text
			}
		}
	}
</script>

<style>
</style>
