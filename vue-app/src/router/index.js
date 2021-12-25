import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: "history",
    
    routes: [
        {
            path: '/',
            component: () => import('@/components/public/Home.vue'),
            meta: { title: 'public' },
            children:[
                {
                    path: '',
                    component: () => import('@/components/public/page/base.vue'),
                    meta: { title: '打造驚人營業額的超強工具！' }
                },
                {
                    path: '404',
                    component: () => import('@/components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '403',
                    component: () => import('@/components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: 'products',
                    component: () => import('@/components/public/page/products.vue'),
                    meta: { title: 'Products' }
                },
                {
                    path: 'products/:item',
                    component: () => import('@/components/public/page/product_item.vue'),
                    meta: { title: 'Products' }
                },
                {
                    path: 'redirect/:code',
                    component: () => import('@/components/public/page/redirect.vue'),
                    meta: { title: 'Products' }
                }
            ]
        },
        {
            path: '/admin',
            component: () => import('@/components/common/Home.vue'),
            meta: { title: 'admin' },
            children:[
                {
                    path: 'deshboard_store',
                    component: () => import('@/components/page/deshboard_store.vue'),
                    meta: { title: '找對的人，幫你賣' }
                },
                {
                    path: 'deshboard_KOL',
                    component: () => import('@/components/page/deshboard_KOL.vue'),
                    meta: { title: '對的商品，我來賣' }
                },
                {
                    path: 'products',
                    component: () => import('@/components/page/store/products.vue'),
                    meta: { title: '我的商品' }
                },
                {
                    path: 'product_pair',
                    component: () => import('@/components/page/store/product_pair.vue'),
                    meta: { title: '我的商品' }
                },
            ]
        },
        {
            path: '/admin/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }       
    ]
})
