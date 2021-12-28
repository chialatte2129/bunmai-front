import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import ElementLocale from 'element-ui/lib/locale';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import './assets/css/icon.css';
import './assets/css/fonts/font.css';
import './components/common/directives';
import "babel-polyfill";
import { store } from './_store';
// import JsEncrypt from 'jsencrypt';
import JsonExcel from 'vue-json-excel';
import VueClipboard from 'vue-clipboard2';
// import VueRouterReferer from '@tozd/vue-router-referer';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import LoadScript from 'vue-plugin-load-script';
import HighchartsVue from 'highcharts-vue';

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(LoadScript);
Vue.use(HighchartsVue);
Vue.config.productionTip = false

Vue.use(VueI18n);
Vue.use(VueClipboard)
Vue.use(ElementUI, {
    size: 'small'
});
Vue.prototype.$axios = axios;
// Vue.prototype.$jsEncrypt = JsEncrypt;
Vue.component('downloadExcel', JsonExcel)
const i18n = new VueI18n({
    locale: localStorage.getItem("ms_user_lang")==undefined ? 'en_US':localStorage.getItem("ms_user_lang"),
    fallbackLocale: 'en_US',
    formatFallbackMessages: true,
    messages
})

// window.jQuery = $;

ElementLocale.i18n((key, value) => i18n.t(key, value))

router.beforeEach((to, from, next) => {
    var title_pre = "KOL幫賣 | "
    console.log(to.path);
    var path_array=to.path.split("/")
    if(path_array[1]=="admin"){
    // if(true){
        // if (path_array[2] != "login" && (localStorage.getItem("ms_user_menus") != undefined && localStorage.getItem("ms_user_menus").indexOf(path_array[2]) < 0) || path_array[2] == "") { //沒權限   
        if (path_array[2] != "login" && (localStorage.getItem("ms_user_menus") != undefined && 1 < 0) || path_array[2] == "") { //沒權限     
            localStorage.removeItem('ms_username');               
            next('/admin/login');
        }
        const ms_username= localStorage.getItem('ms_username');
        if (!ms_username && to.path !== '/admin/login') {
            next('/admin/login');
        }else{
            if (to.meta.title){
                document.title = title_pre + to.meta.title;
            }
            next();
        }
    }else{
        if (to.meta.title){
            document.title = title_pre + to.meta.title;
        }
        next();
    }
})


new Vue({
    router,
    store,
    i18n,
    // VueQr,
    render: h => h(App)
}).$mount('#app')

