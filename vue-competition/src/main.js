import Vue from 'vue'
import App from './App.vue'
import Public from './Public.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import ElementLocale from 'element-ui/lib/locale';
import Notification from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";
import { store } from './_store';
import JsEncrypt from 'jsencrypt';
import { Base64 } from 'js-base64';
import enLocale from 'element-ui/lib/locale/lang/en';
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';
import jaLocale from 'element-ui/lib/locale/lang/ja';
import twLocale from 'element-ui/lib/locale/lang/zh-TW';
import JsonExcel from 'vue-json-excel';
import VueClipboard from 'vue-clipboard2';

Vue.config.productionTip = false
Vue.use(VueI18n);
Vue.use(VueClipboard)
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

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    
    var path_id=to.path.replace("/","");
    var path_array=to.path.split("/")
    console.log(to.path, ' >>> ',path_id);

    if(path_array[1]=="public" || path_array[1]=="registration"){
        if(path_array[1]=="registration"){
            localStorage.clear();
            localStorage.setItem("register_lang",false);
        }
        
        next();
    }else{
        if (path_id != "login" && (localStorage.getItem("ms_user_menus") != undefined && localStorage.getItem("ms_user_menus").indexOf(path_id) < 0) || path_id == "") { //沒權限     
             
            localStorage.removeItem('ms_username');               
            next('/login');
        }
        const ms_username= localStorage.getItem('ms_username');
        if (!ms_username && to.path !== '/login') {
            
            next('/login');
        }  else {
            // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
            if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
                Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                    confirmButtonText: '确定'
                });
            } else {
                next();
            }
        }
    }    
})


new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')

