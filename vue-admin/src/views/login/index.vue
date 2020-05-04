<template>
  <div id="login">
    <div class="middle">
      <ul class="top">
        <li
          @click="Active(item)"
          :class="['loginName',item.CurrentFlag === isShow?'active':null]"
          v-for="(item,ind) of list"
          :key="ind"
        >{{item.title}}</li>
      </ul>
      <el-form
        status-icon
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        ref="LoginruleForm"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="邮箱" class="email" prop="email">
          <el-input type="text" placeholder="请填写您的QQ或者新浪邮箱" v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="paw">
          <el-input
            minlength="6"
            maxlength="20"
            type="password"
            placeholder="请填写数字加上字母的6位及以上密码"
            v-model="ruleForm.paw"
          ></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="paws" v-show="modal===`register`">
          <el-input
            type="password"
            minlength="6"
            maxlength="20"
            placeholder="请输入重复密码"
            v-model="ruleForm.paws"
          ></el-input>
        </el-form-item>
        <el-form-item label-width="30" label="验证码" prop="ruleCode">
          <el-row :gutter="15">
            <el-col :span="15">
              <el-input
                minlength="6"
                type="text"
                maxlength="6"
                placeholder="请输入6位数的验证码"
                v-model="ruleForm.ruleCode"
              ></el-input>
            </el-col>
            <el-col :span="7">
              <el-button
                @click="getCode(CodeStatus)"
                :disabled="CodeStatus[`CodeStatus`]"
                type="success"
              >{{CodeStatus[`title`]}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            plain
            :disabled="ButtonStatus"
            class="submitForm"
            @click="submitForm('LoginruleForm')"
          >{{modal === 'login'?"登录":"注册"}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import * as api from "@/api/login.js";
import sha1 from "js-sha1";
import { reactive, ref, isRef, toRefs, onMounted } from "@vue/composition-api";
import { stripscript, VeriEmail, VeriPaw, VeriCode } from "@/utils/index.js";
export default {
  name: "login",
  setup(props, context) {
    // 这里放置data数据、生命周期、自定义的函数
    //data数据
    const ruleForm = reactive({
      email: "",
      paw: "",
      paws: "",
      ruleCode: ""
    });
    const list = reactive([
      {
        title: "登录",
        CurrentFlag: true,
        type: "login"
      },
      {
        title: "注册",
        CurrentFlag: false,
        type: "register"
      }
    ]);
    /* 邮箱表单验证规则 */
    let emailRules = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("邮箱不能为空!"));
      } else if (!VeriEmail(value)) {
        return callback(new Error("您的邮箱格式错误!"));
      } else {
        callback();
      }
    };
    /* 密码表单验证规则 */
    let pawRules = (rule, value, callback) => {
      // 将过渡好的数据重新加载进表单中
      ruleForm.paw = stripscript(value);
      // 这个赋值是用于下面的操作
      value = ruleForm.paw;
      // 数字加上字母规则
      if (value === "") {
        callback(new Error("密码不能为空!"));
      } else if (!VeriPaw(value)) {
        callback(new Error("请填写数字加上字母的6位及以上的密码!"));
      } else {
        callback();
      }
    };
    /* 重复密码表单验证规则 */
    const pawsRules = (rule, value, callback) => {
      // 如果当前是登录页面，则不用验证规则
      if (modal.value === "login") {
        callback();
        return true;
      }
      // 将过渡好的数据重新加载进表单中
      ruleForm.paws = stripscript(value);
      // 这个赋值是用于下面的操作
      value = ruleForm.paw;
      if (value === "") {
        callback(new Error("密码不能为空!"));
      } else if (value !== ruleForm.paws) {
        callback(new Error("重复密码不一致,请重新输入!"));
      } else {
        callback();
      }
    };
    /*验证码验证规则*/
    const CodeRules = (rule, value, callback) => {
      // let reg = /^[a-z0-9]{6}/;
      if (value === "") {
        callback(new Error("验证码不能为空!"));
      } else if (!VeriCode(value)) {
        callback(new Error("验证码格式不正确!"));
      } else {
        callback();
      }
    };
    const rules = reactive({
      paw: [
        {
          required: true,
          validator: pawRules,
          trigger: "blur"
        }
      ],
      paws: [
        {
          required: true,
          validator: pawsRules,
          trigger: "blur"
        }
      ],
      email: [
        {
          validator: emailRules,
          required: true,
          trigger: "blur"
        }
      ],
      ruleCode: [
        {
          validator: CodeRules,
          required: true,
          trigger: "blur"
        }
      ]
    });
    const modal = ref(`login`);
    // 定义“导航”状态
    const isShow = ref(true);
    // 定义导航Button的状态
    const ButtonStatus = ref(true);
    // 定义计时器标记
    const timerflag = ref(null);
    // “获取验证码”按钮的状态
    const CodeStatus = reactive({
      CodeStatus: false,
      title: "获取验证码"
    });
    //自定义的函数
    /* 导航位置点击事件*/
    const Active = val => {
      // 重置表单内容
      resetForm();
      // “获取验证码”回到初始化状态
      ClearInit();
      // 初始化
      // 因为是引用类型，所以会改变原对象
      list.forEach(item => {
        item.CurrentFlag = false;
      });
      val.CurrentFlag = true;
      // 改变模块的状态
      modal.value = val.type;
    };
    /*重置表单内容 */
    const resetForm = () => {
      context.refs.LoginruleForm.resetFields();
    };
    /* “获取验证码按钮”的封装 */
    const CodeButton = params => {
      Object.assign(CodeStatus, {
        CodeStatus: params.CodeStatus,
        title: params.title
      });
    };
    /*清除定时器 */
    const ClearInterval = () => {
      clearInterval(timerflag.value);
    };
    /**获取验证码 */
    const getCode = async item => {
      // 提示
      if (!ruleForm.email) {
        context.root.$message.error("邮箱不能为空!");
        return false;
      }
      // “获取验证码按钮”的状态
      CodeButton({
        CodeStatus: true,
        title: "发送中..."
      });
      timer();
      let res = await api.GetCode({
        username: ruleForm.email,
        // 当进行切换导航栏时，动态更改参数
        module: modal.value
      });
      if (res.data.resCode === 0) {
        context.root.$message({
          message: res.data.message,
          type: "success"
        });
        // 发送成功后将登录/注册按钮打开
        ButtonStatus.value = false;
      }
    };
    /* 短信倒计时 */
    const timer = (num = 30) => {
      timerflag.value && ClearInterval();
      timerflag.value = setInterval(() => {
        if (!num) {
          ClearInterval();
          // “获取验证码按钮”的状态
          CodeButton({
            CodeStatus: false,
            title: "再次获取"
          });
        } else {
          num--;
          CodeButton({
            CodeStatus: true,
            title: `倒时时${num}秒`
          });
        }
      }, 1000);
    };
    /*注册接口 */
    const API_Register = async data => {
      return await api.Register(data);
    };
    /*登录接口 */
    const API_Login = async data => {
      return await api.Login(data);
    };
    /*登录｜注册的提示信息 */
    const Message = data => {
      if (data.resCode === 0) {
        context.root.$message.success(data.message);
      } else {
        console.log(data.message);
        context.root.$message.success(data.message);
      }
    };
    /*“获取验证码”回到初始化状态*/
    const ClearInit = () => {
      // “获取验证码按钮”的状态
      CodeButton({
        CodeStatus: false,
        title: "获取验证码"
      });
      ClearInterval();
    };
    /*提交按钮*/
    const submitForm = formName => {
      context.refs[formName].validate(async valid => {
        if (valid) {
          let FormData = {
            username: ruleForm.email,
            password: sha1(ruleForm.paw),
            code: ruleForm.ruleCode
          };
          if (modal.value === "login") {
            let res = await API_Login(FormData);
            Message(res.data);
          } else {
            let res = await API_Register(FormData);
            Message(res);
          }
        } else {
          context.root.$message.error("error submit!!");
          return false;
        }
      });
    };
    // Vue3.0生命周期
    onMounted(() => {
      console.log("挂载完成后：", process.env.VUE_APP_BASEURL);
    });
    return {
      list,
      modal,
      ButtonStatus,
      CodeStatus,
      isShow,
      Active,
      ruleForm,
      rules,
      submitForm,
      getCode
    };
  }
};
</script>
<style lang='scss'>
.el-form {
  height: 80%;
}
.el-form--label-top .el-form-item__label {
  color: #fff;
  padding: 0;
}
.submitForm {
  display: block;
  width: 100%;
  margin-top: 6%;
}
#login {
  height: 100vh;
  background: #344a5f;

  .middle {
    width: 330px;
    height: 60%;
    margin: 0 auto;
    padding-top: 20vh;
    .el-form-item {
      margin-bottom: 10px;
    }
    .top {
      width: 75%;
      margin: 0 auto;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-around;
      align-items: center;
      .loginName,
      .registerName {
        width: 30%;
        transition: all 0.7s ease-out;
        height: 50%;
        line-height: 2rem;
        text-align: center;
      }
      .active {
        text-shadow: -3px 3px 3px rgb(94, 93, 93);
        color: #fff;
        font-size: 15px;
        border-radius: 9px;
        background: #3a76b2;
      }
    }
  }
}
</style>
