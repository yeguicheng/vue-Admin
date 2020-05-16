<template>
  <div id="layoutNavMenu">
    <h1 class="logo">
      <img src="../../../../public/images/main.png" />
    </h1>
    <el-menu
      :default-openeds="['1']"
      :unique-opened="true"
      default-active="/consoleIndex"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <template v-for="(item,ind) of routers">
        <!-- 一级菜单  -->
        <el-submenu v-if="!item.hidden" :index="item.meta.id" :key="ind">
          <template slot="title">
            <!-- <i :class="item.meta.icon"></i> -->
            <SvgIcon :IconName="item.meta.icon" :IconClass="item.meta.icon" />
            <span>{{item.meta.name}}</span>
          </template>
          <el-menu-item-group v-for="(vals,ind) of item.children" :key="ind">
            <!-- <template slot="title">{{vals.meta.name}}</template> -->
            <!-- 二级菜单  -->
            <el-menu-item :index="vals.path">
              <!-- <i :class="vals.meta.icon"></i> -->
              <SvgIcon :IconName="vals.meta.icon" IconClass="Menu" />
              {{vals.meta.name}}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>
<script>
import { ref, reactive, onMounted, computed } from "@vue/composition-api";
export default {
  name: "layoutNavMenu",
  setup(props, context) {
    //   data数据
    // 是否开启导航折叠
    /*computed监听state状态 */
    const isCollapse = computed(() => context.root.$store.state.isCollapse);
    // 路由对象
    const routers = reactive(context.root.$router.options.routes);
    // 自定义方法
    const handleOpen = () => {};
    const handleClose = () => {};
    onMounted(() => {
      // console.log(context.root.$router);
    });
    return {
      isCollapse,
      handleOpen,
      handleClose,
      routers
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#layoutNavMenu {
  width: $navMenu;
  height: 100vh;
  position: fixed;
  @include webkit(transition, all 0.5s ease 0s);
  top: 0;
  left: 0;
  overflow: hidden;
  background: #344a5f;
  .el-menu-vertical-demo {
    width: 100%;
    height: 100%;
  }
  svg {
    vertical-align: middle;
    font-size: 20px;
    margin-right: 3%;
  }
  span {
    vertical-align: middle;
  }
}
.open {
  #layoutNavMenu {
    width: $navMenu;
  }
}
.close {
  #layoutNavMenu {
    width: 3.9%;
    padding-top: 0.5%;
    .logo {
      width: 63.9%;
      img {
        width: 100%;
        height: 100%;
        // transform: scale(.5);
      }
    }
    span {
      font-size: 0;
    }
  }
}
.logo {
  width: 92px;
  text-align: center;
  margin: auto;
  padding-bottom: 2px;
}
</style>