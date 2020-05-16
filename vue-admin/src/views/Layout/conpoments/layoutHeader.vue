<template>
  <div id="layoutHeader">
    <div class="pull-left header-icon" @click="MenuCollapse">
      <SvgIcon IconName="Menu" IconClass="menu" />
    </div>
    <div class="pull-rght">
      <div class="user-info">
        <SvgIcon IconName="maleAdmin" IconClass="maleAdmin" />
        <span class="userName">{{username}}</span>
      </div>
      <div @click="exit">
        <SvgIcon IconName="logout" IconClass="exit" />
      </div>
    </div>
  </div>
</template>
<script>
import { setup, computed } from "@vue/composition-api";
export default {
  name: "layoutHeader",
  setup(props, context) {
    const MenuCollapse = () => {
      context.root.$store.commit("app/SET_COLLAPSE");
    };
    const username = computed(() => {
      return context.root.$store.state.app.username;
    });
    const exit = () => {
      context.root
        .$confirm("是否确定退出?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          context.root.$store.dispatch("app/exit").then(() => {
            context.root.$router.replace("login");
            context.root.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          context.root.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    };
    return {
      MenuCollapse,
      username,
      exit
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#layoutHeader {
  height: 70px;
  //   line-height: 70px;
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  top: 0;
  left: $navMenu;
  right: 0;
  @include webkit(transition, all 0.5s ease 0s);
  background: #ffffff;
  box-shadow: 0 3px 16px rgba(0, 0, 0, 0.1);
  .svg-icon {
    &.menu {
      color: #000;
    }
  }
  .header-icon {
    width: auto;
    padding: 0 32px;
    svg {
      font-size: 25px;
      cursor: pointer;
    }
  }
  .pull-rght {
    width: auto;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-info {
      width: 100%;
      height: 100%;
      font-size: 14px;
      line-height: 70px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-right: 1px solid #ededed;
      // .maleAdmin{
      //   width: 10%;
      // }
      .userName {
        width: 80%;
        vertical-align: middle;
      }
    }
    svg {
      color: #000;
      font-size: 25px;
      width: 75px;
      vertical-align: middle;
      cursor: pointer;
    }
  }
}
.open {
  #layoutHeader {
    left: $navMenu;
  }
}
.close {
  #layoutHeader {
    left: $left;
  }
}
</style>