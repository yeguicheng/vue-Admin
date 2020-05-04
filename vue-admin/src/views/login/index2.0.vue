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
              <el-button type="success">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" plain class="submitForm" @click="submitForm('LoginruleForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { stripscript, VeriEmail, VeriPaw, VeriCode } from "@/utils/index.js";
export default {
  name: "login",
  data() {
    return {
      ruleForm: {
        email: "",
        paw: "",
        paws: "",
        ruleCode: ""
      },
      rules: {
        paw: [
          {
            required: true,
            validator: this.pawRules,
            trigger: "blur"
          }
        ],
        paws: [
          {
            required: true,
            validator: this.pawsRules,
            trigger: "blur"
          }
        ],
        email: [
          {
            validator: this.emailRules,
            required: true,
            trigger: "blur"
          }
        ],
        ruleCode: [
          {
            validator: this.CodeRules,
            required: true,
            trigger: "blur"
          }
        ]
      },
      list: [
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
      ],
      // 模块默认状态
      modal: `login`,
      isShow: true
    };
  },
  methods: {
    Active(val) {
      // 因为初始化时
      // 因为是引用类型，所以会改变原对象
      this.list.forEach(item => {
        item.CurrentFlag = false;
      });
      val.CurrentFlag = true;
      // 改变模块的状态
      this.modal = val.type;
    },
    // 邮箱表单验证规则
    emailRules(rule, value, callback) {
      if (value == "") {
        return callback(new Error("邮箱不能为空!"));
      } else if (!VeriEmail(value)) {
        return callback(new Error("您的邮箱格式错误!"));
      } else {
        callback();
      }
    },
    // 密码表单验证规则
    pawRules(rule, value, callback) {
      // 将过渡好的数据重新加载进表单中
      this.ruleForm.paw = stripscript(value);
      // 这个赋值是用于下面的操作
      value = this.ruleForm.paw;
      // 数字加上字母规则
      if (value === "") {
        callback(new Error("密码不能为空!"));
      } else if (!VeriPaw(value)) {
        callback(new Error("请填写数字加上字母的6位及以上的密码!"));
      } else {
        callback();
      }
    },
    // 重复密码表单验证规则
    pawsRules(rule, value, callback) {
      // 如果当前是登录页面，则不用验证规则
      if (this.modal === "login") {
        callback();
        return true;
      }
      // 将过渡好的数据重新加载进表单中
      this.ruleForm.paws = stripscript(value);
      // 这个赋值是用于下面的操作
      value = this.ruleForm.paw;
      if (value === "") {
        callback(new Error("密码不能为空!"));
      } else if (value !== this.ruleForm.paws) {
        callback(new Error("重复密码不一致,请重新输入!"));
      } else {
        callback();
      }
    },
    // 验证码验证规则
    CodeRules(rule, value, callback) {
      // let reg = /^[a-z0-9]{6}/;
      if (value === "") {
        callback(new Error("验证码不能为空!"));
      } else if (!VeriCode(value)) {
        callback(new Error("验证码格式不正确!"));
      } else {
        callback();
      }
    },
    // 提交按钮
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.ruleForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
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
