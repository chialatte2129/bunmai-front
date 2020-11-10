<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn">
       <el-image
      style="width: 50px; height: 50px; margin-top:10px;"
      src="/image/logo/VARBOX-logo-w.png"
      fit='scale-down'></el-image>
    </div>
    <div class="logo">{{$t('app.title_short')}}</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen? $t('app.not_full_screen'):$t('app.full_screen')" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        -->
            <i v-if="isadmin" class="el-icon-lx-crown" ></i>   
        <!-- 語言下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand_lang">
          <span class="el-dropdown-link">
            {{$t('btn.i18n_lang')}} : {{$t(user_lang)}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided command="zh_TW">{{$t('app.lang_zh_TW')}}</el-dropdown-item>
            <el-dropdown-item divided command="en_US">{{$t('app.lang_en_US')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>    
        <!-- 用户头像 -->
        <div class="user-avator">          
          <i class="el-icon-lx-people" ></i>  
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{username}}  
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided command="opendialog">{{$t('account.change_password')}}</el-dropdown-item>
            <el-dropdown-item divided command="loginout">{{$t('account.logout')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <el-dialog :title="$t('account.change_password')" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item :label="$t('account.input_old_pass')" prop="old_pass" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.old_pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('account.input_new_pass')" prop="new_pass" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.new_pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('account.input_confirm_pass')" prop="confirm_pass" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.confirm_pass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary" @click="confirm_password('form')">{{$t('btn.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import bus from "../common/bus";
import { accountService } from "@/_services";
import { Message } from "element-ui";

export default {
  data() {
    return {
      collapse: false,
      fullscreen: false,
      name: "linxin",
      message: 2,  
      formLabelWidth: "150px",
      dialogFormVisible: false,
      isadmin:localStorage.getItem("ms_is_admin")=='true' ? true:false,
      form: {
        old_pass: "",
        new_pass: "",
        confirm_pass: ""
      },
      rules: {
        old_pass: [
          { required: true, message: this.$i18n.t('account.alert_input_old_pass') , trigger: "blur" }
        ],
        new_pass: [{ required: true, message: this.$i18n.t('account.alert_input_new_pass'), trigger: "blur" },{ min: 6, max: 12, message: this.$i18n.t('rules.password_len'), trigger: 'blur' }]
        ,
        confirm_pass: [{ required: true, message: this.$i18n.t('account.alert_input_confirm_pass'), trigger: "blur" },{ min: 6, max: 12, message: this.$i18n.t('rules.password_len'), trigger: 'blur' }]
      }
    };
  },
  computed: {
    username() {
      let userfullname = localStorage.getItem("ms_user_fullname");
      let username = localStorage.getItem("ms_username");
      return userfullname !='' ? userfullname: username;
    },
    user_lang(){
      if(localStorage.getItem("ms_user_lang")==undefined||localStorage.getItem("ms_user_lang")=='en'){
        return 'app.lang_en_US'
      }
      return 'app.lang_'+localStorage.getItem("ms_user_lang");
    }
  },
  methods: {
      reload () {
     this.isRouterAlive = false
     this.$nextTick(() => (this.isRouterAlive = true))
   }  ,
     // 語系下拉菜单选择事件
     handleCommand_lang(command) { 
       console.log(command)              
        localStorage.setItem("ms_user_lang",command);
        this.$i18n.locale =command     
        this.$router.go(0)   //reload page
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        localStorage.removeItem("ms_username");
        localStorage.removeItem("ms_user_token");
        this.$router.push("/login");
      }
      if (command == "opendialog") {
        this.dialogFormVisible = true;
      }  
    },
    confirm_password(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.new_pass != this.form.confirm_pass) {
            Message({
              type: "error",
              message: this.$t("account.new_confirm_pass_not_match")
            });
            return false;
          } else {
            //call change password
            var user_token = localStorage.getItem("ms_user_token");
            var old_scr_pass = btoa(btoa(this.form.old_pass));
            var new_scr_pass = btoa(btoa(this.form.new_pass));
            accountService
              .change_password(user_token, old_scr_pass, new_scr_pass)
              .then(result => {
                if (result.msg_code == 1) {
                  //change ok
                  Message({
                    type: "info",
                    message: this.$t(result.msg_i18n)
                  });
                   return true;
                } else {
                  console.log(result.msg);
                  Message({
                    type: "error",
                    message: this.$t(result.msg_i18n)
                  });
                  return false;
                }
              }).then(rs =>  {                  
                 if(rs) {
                     this.dialogFormVisible = false;
                 }
              }
              );
          
          }
        } else {         
          return false;
        }
      });
    },
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    }
  },
  mounted() {
    if (document.body.clientWidth < 1920) {
      this.collapseChage();
    }
  }
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
  background-color: #000000;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  height:70px;
  line-height: 70px;
}
.header .logo {
  float: left;
  width: 200px;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
