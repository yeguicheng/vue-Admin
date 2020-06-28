import {
	ref
} from "@vue/composition-api"
export function recordPage() {
	let str = ref(123);
	const fu1 = () => {}
	return {
		str,
		fu1
	}
}
