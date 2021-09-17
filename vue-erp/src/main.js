import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import ElementLocale from 'element-ui/lib/locale';
import 'element-ui/lib/theme-chalk/index.css';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import './assets/css/icon.css';
import './assets/css/fonts/font.css';
import './components/common/directives';
import "babel-polyfill";
import { store } from './_store';
import JsEncrypt from 'jsencrypt';
import JsonExcel from 'vue-json-excel';
import VueClipboard from 'vue-clipboard2';
import HighchartsVue from "highcharts-vue";
import LoadScript from "vue-plugin-load-script";
Vue.config.productionTip = false
Vue.use(LoadScript);
Vue.use(VueI18n);
Vue.use(VueClipboard)
Vue.use(HighchartsVue);
Vue.use(ElementUI, {
    size: 'small'
});
Vue.prototype.$axios = axios;
Vue.prototype.$jsEncrypt = JsEncrypt;
Vue.component('downloadExcel', JsonExcel)
const i18n = new VueI18n({
    locale: localStorage.getItem("ms_user_lang")==undefined ? 'en_US':localStorage.getItem("ms_user_lang"),
    fallbackLocale: 'en_US',
    formatFallbackMessages: true,
    messages
})
ElementLocale.i18n((key, value) => i18n.t(key, value))
import { accountService } from "@/_services";
import { Message } from "element-ui";
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {     
    var path_id=to.path.replace("/","");
    var path_array=to.path.split("/")
    var ms_username= localStorage.getItem('ms_username');
    console.log(to.path, ' >>> ',path_id, " who >",ms_username);
    if(path_id == "redirect") {
        if(to.query.ms_username != undefined && to.query.ms_user_token != undefined && to.query.target!= undefined){
            path_id=to.query.target;
            accountService.redirect_login(to.query.ms_username,to.query.ms_user_token)
            .then(function(result) {
                if (result.msg_code == 1) {
                  localStorage.setItem("ms_user_id", result.data.account_id);
                  localStorage.setItem("ms_user_token", result.data.token);
                  localStorage.setItem("ms_username", result.data.username);
                  localStorage.setItem("ms_user_fullname", result.data.user_full_name);
                  localStorage.setItem("ms_is_admin", result.data.is_admin);  
                  localStorage.setItem("ms_is_odoo", result.data.is_odoo_user);  
                  localStorage.setItem("ms_odoo_user_id", result.data.odoo_user_id);  
                  localStorage.setItem("ms_user_menus", result.data.user_menus); 
                  localStorage.setItem("ms_user_actions", result.data.user_actions);
                  localStorage.setItem("ms_odoo_user_id", result.data.odoo_user_id);
                  localStorage.setItem("ms_odoo_employee_id", result.data.odoo_employee_id);
                  if(result.data.user_menus.indexOf(to.query.target) >=0){
                    next(to.query.target);
                  }       
                }
                else {
                    Message({
                      type: "error",
                      message: result.msg
                    });
                  } 
              })
           
        } 
    }
    if (path_id != "login" && (localStorage.getItem("ms_user_menus") != undefined && localStorage.getItem("ms_user_menus").indexOf(path_id) < 0) || path_id == "") { //沒權限                 
        localStorage.removeItem('ms_username');               
        next('/login');
    }    
    if (!ms_username && to.path !== '/login') {        
        next('/login');
    }  else {
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
})


new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')

