import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: '/public',
            component: resolve => require(['../components/public/Home.vue'], resolve),
            meta: { title: '自述文件' },
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/role_edit',
                    component: resolve => require(['../components/page/Roles.vue'], resolve),
                    meta: { title:  'menus.role_edit' }
                },            
                {
                    path: '/user_edit',
                    component: resolve => require(['../components/page/Users.vue'], resolve),
                    meta: { title: 'menus.user_edit' }
                }, 
                {
                    path: '/dictionary_setting',
                    component: resolve => require(['../components/page/DictionarySetting.vue'], resolve),
                    meta: { title: 'menus.dict_setting' }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        },
    ]
})
