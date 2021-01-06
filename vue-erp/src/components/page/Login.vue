<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">{{$t('app.title')}} </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input  v-model="ruleForm.username" placeholder="username">
            <i slot="prepend" class="el-icon-lx-people"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password"
            v-model="ruleForm.password"
            @keyup.enter.native="submitForm('ruleForm')"
          >
            <i slot="prepend" class="el-icon-lx-lock"></i>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">{{$t('account.login')}}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { accountService } from "@/_services";
import router from "@/router";
import { Message } from "element-ui";
import * as myFun from "@/components/common/functions.js";

export default {
  data: function() {
    return {     
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: this.$t("account.input_login_name"),
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: this.$t("account.input_login_pass"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //加密
          if (localStorage.getItem("ms_user_lang")==undefined || localStorage.getItem("ms_user_lang")==null){
            localStorage.setItem("ms_user_lang","en");
          }
          var scr_pass = btoa(btoa(this.ruleForm.password));
          accountService
            .login(this.ruleForm.username,scr_pass)
            .then(function(result) {
              if (result.msg_code == 1) {
                var menus = ["dictionary_setting","role_edit","user_edit"];
                localStorage.setItem("ms_user_id", result.data.account_id);
                localStorage.setItem("ms_odoo_token",scr_pass);
                localStorage.setItem("ms_user_token", result.data.token);
                localStorage.setItem("ms_username", result.data.username);
                localStorage.setItem("ms_user_fullname", result.data.user_full_name);
                localStorage.setItem("ms_is_admin", result.data.is_admin);  
                localStorage.setItem("ms_is_odoo", result.data.is_odoo_user);  
                localStorage.setItem("ms_odoo_user_id", result.data.odoo_user_id);  
                localStorage.setItem("ms_user_menus", result.data.user_menus); 
                localStorage.setItem("ms_user_actions", result.data.user_actions);
                localStorage.setItem("is_dept_manager", result.data.is_dept_manager);
                console.log('menus =',result.data.user_menus)
                console.log('actions =',result.data.user_actions)
                console.log("is_odoo_user = ",result.data.is_odoo_user==1)
                console.log("is_dept_manager = ",result.data.is_dept_manager)
                if (result.data.user_menus.length > 0) {
                  localStorage.setItem(
                    "ms_user_home",
                    result.data.user_menus[0]
                  );
                } else {
                  localStorage.setItem("ms_user_home", "/");
                } 
                
                console.log('go home =',localStorage.getItem("ms_user_home"))                                 
                router.push(localStorage.getItem("ms_user_home"));
              } else {
                return result;
              }
            })
            .then(rs => {              
              if (rs && rs.msg_code == 0) {
                Message({
                  type: "error",
                  message: this.$t(rs.msg_i18n)
                });
              } else if (rs && rs.msg_code == -1) {
                Message({
                  type: "error",
                  message: this.$t(rs.msg)
                });
              }
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image:url('/image/bg/Bg.png');
  background-repeat:repeat-x;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: rgb(2, 1, 17);
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>