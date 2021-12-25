<template>
  <div class="login-container">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">KOL幫賣管理平台</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <b><i style="font-size:24px;" class="el-icon-user-solid"/></b>
        </span>
        <el-input
          ref="username"
          v-model="ruleForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <b><i style="font-size:24px;" class="el-icon-lock"/></b>
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="ruleForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="submitForm('ruleForm')"
          />
          <span class="show-pwd" @click="showPwd">
            <b><i style="font-size:20px;" class="el-icon-view"/></b>
          </span>
        </el-form-item>
      </el-tooltip>
      <el-button :loading="loading" :disabled="true" type="success" style="width:48%;margin-bottom:30px;height:40px;" @click="submitForm('ruleForm')">
        <span style="font-size:18px;font-weight:bold;">註冊</span>
      </el-button>
      <el-button :loading="loading" type="primary" style="width:48%;margin-bottom:30px;height:40px;" @click="submitForm('ruleForm')">
        <span style="font-size:18px;font-weight:bold;">登入</span>
      </el-button>
      <div style="position:relative">
        
      </div>
    </el-form>
  </div>
</template>

<script>
import router from "@/router";

export default {
  data: function() {
    return {   
      passwordType:"password",
      loading:false,  
      ruleForm: {
        username: 'admin',
        password: '111111'
      },
      
      capsTooltip: false,
      rules: {
        username: [
          {
            required: true,
            message: "請輸入帳號",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "請輸入密碼",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },

    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (localStorage.getItem("ms_user_lang")==undefined || localStorage.getItem("ms_user_lang")==null){
            localStorage.setItem("ms_user_lang","zh_TW");
          }
          var res = {
            token:"vue-admin-system",
            username:"Admin",
            full_username:"廣告商帳號",
            user_menus:['deshboard_store','deshboard_KOL'],
          }

          localStorage.setItem("ms_user_token", res.token);
          localStorage.setItem("ms_username", res.username);
          localStorage.setItem("ms_user_fullname", res.full_username); 
          localStorage.setItem("ms_user_menus", res.user_menus); 
          localStorage.setItem("ms_user_home","/admin/deshboard_store");
          router.push(localStorage.getItem("ms_user_home"));
        } else {
          return false;
        }
      });
    }
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {
    //       //加密
    //       if (localStorage.getItem("ms_user_lang")==undefined || localStorage.getItem("ms_user_lang")==null){
    //         localStorage.setItem("ms_user_lang","en");
    //       }
    //       var scr_pass = btoa(btoa(this.ruleForm.password));
    //       accountService
    //         .login(this.ruleForm.username,scr_pass)
    //         .then(function(result) {
    //           if (result.msg_code == 1) {
    //             // var menus = ["dictionary_setting","role_edit","user_edit"];
    //             localStorage.setItem("ms_user_token", result.data.token);
    //             localStorage.setItem("ms_username", result.data.username);
    //             localStorage.setItem("ms_user_fullname", result.data.user_full_name); 
    //             localStorage.setItem("ms_user_menus", result.data.user_menus); 
    //             console.log('menus =',result.data.user_menus)
    //             // console.log('actions =',result.data.user_actions)
    //             if (result.data.user_menus.length > 0) {
    //               localStorage.setItem(
    //                 "ms_user_home",
    //                 result.data.user_menus[0]
    //               );
    //             } else {
    //               localStorage.setItem("ms_user_home", "/");
    //             } 
                
    //             console.log('go home =',localStorage.getItem("ms_user_home"))                                 
    //             router.push(localStorage.getItem("ms_user_home"));
    //           } else {
    //             return result;
    //           }
    //         })
    //         .then(rs => {              
    //           if (rs && rs.msg_code == 0) {
    //             Message({
    //               type: "error",
    //               message: this.$t(rs.msg_i18n)
    //             });
    //           } else if (rs && rs.msg_code == -1) {
    //             Message({
    //               type: "error",
    //               message: this.$t(rs.msg)
    //             });
    //           }
    //         });
    //     } else {
    //       return false;
    //     }
    //   });
    // }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    max-width: 520px;
    // max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 10px 5px 0px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>