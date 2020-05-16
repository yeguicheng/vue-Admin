<template>
  <div id="Layout" :class="[MenuState ? 'close' :'open']">
    <layout-header />
    <layout-main />
    <layout-nav-menu />
  </div>
</template>
<script>
import { setup, computed } from "@vue/composition-api";
// 头部
import layoutHeader from "./conpoments/layoutHeader.vue";
// 内容
import layoutMain from "./conpoments/layoutMain.vue";
// 菜单
import layoutNavMenu from "./conpoments/layoutNavMenu.vue";
export default {
  name: "Layout",
  components: {
    layoutHeader,
    layoutMain,
    layoutNavMenu
  },
  setup(props, { root }) {
    /*computed监听状态 */
    const MenuState = computed(() => root.$store.state.app.isCollapse);
    return {
      MenuState
    };
  }
};
</script>