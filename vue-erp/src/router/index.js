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
                {
                    path: '/day_item_person',
                    component: () => import('../components/page/project_manage/day_item_person.vue'),
                    meta: { title:  'menus.day_item_person' }
                },   
                {
                    path: '/day_item_review',
                    component: () => import('../components/page/project_manage/day_item_review.vue'),
                    meta: { title:  'menus.day_item_review' }
                },         
                {
                    path: '/work_items',
                    component: () => import('../components/page/project_manage/work_items.vue'),
                    meta: { title: 'menus.work_items' }
                },
                {
                    path: 'project_report_download',
                    component: () => import('../components/page/project_manage/report_download.vue'),
                    meta: { title: 'menus.project_report_download' }
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
