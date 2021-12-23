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
                    path: '/work_item_cost',
                    component: () => import('../components/page/project_manage/work_item_cost.vue'),
                    meta: { title: 'menus.work_items' }
                },
                {
                    path: '/work_item_cost_edit',
                    component: () => import('../components/page/project_manage/work_item_cost_edit.vue'),
                    meta: { title: 'menus.work_items' }
                },
                {
                    path: '/work_item_pay',
                    component: () => import('../components/page/project_manage/work_item_pay.vue'),
                    meta: { title: 'menus.work_items' }
                },
                {
                    path: 'project_report_download',
                    component: () => import('../components/page/project_manage/report_download.vue'),
                    meta: { title: 'menus.project_report_download' }
                },
                {
                    path: 'overtime_filing',
                    component: () => import('../components/page/overtime/filing.vue'),
                    meta: { title: 'menus.project_report_download' }
                },
                {
                    path: 'overtime_report',
                    component: () => import('../components/page/overtime/report.vue'),
                    meta: { title: 'menus.project_report_download' }
                },
                {
                    path: 'overtime_process',
                    component: () => import('../components/page/overtime/process.vue'),
                    meta: { title: 'menus.project_report_download' }
                },
                {
                    path: 'overtime_person_record',
                    component: () => import('../components/page/overtime/record.vue'),
                    meta: { title: 'menus.project_report_download' }
                },
                {
                    path: 'view_work_hours',
                    component: () => import('../components/page/report/view_workhours.vue'),
                    meta: { title: 'menus.project_report_download' }
                },
                {
                    path: 'day_item_report_project',
                    component: () => import('../components/page/project_manage/day_item_report_project.vue'),
                    meta: { title: 'menus.day_item_report_project' }
                },
                {
                    path: 'daily_jobs_person',
                    component: () => import('../components/page/daily_jobs/person.vue'),
                    meta: { title:  'menus.daily_jobs_person' }
                },   
                {
                    path: 'daily_jobs_review',
                    component: () => import('../components/page/daily_jobs/review.vue'),
                    meta: { title:  'menus.daily_jobs_review' }
                },  
                {
                    path: '/project_cost_upload',
                    component: () => import('../components/page/project_manage/project_cost_upload.vue'),
                    meta: { title:  'menus.project_cost_upload' }
                },
                {
                    path: '/supplier_accounts',
                    component: () => import('../components/page/partner/supplier_accounts.vue'),
                    meta: { title:  'menus.supplier_accounts' }
                },   
                {
                    path: '/project_funnel_review',
                    component: () => import('../components/page/project_manage/funnel_review.vue'),
                    meta: { title:  'menus.project_funnel_review' }
                },   
                {
                    path: '/calendar_setting',
                    component: () => import('../components/page/hr_setting/calendar_setting.vue'),
                    meta: { title:  'menus.calendar_setting' }
                }
            ]
        },
        
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/redirect',
            component: resolve => require(['../components/page/Redirect.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        },
    ]
})
