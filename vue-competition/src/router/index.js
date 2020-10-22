import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/public',
            component: resolve => require(['../components/public/Home.vue'], resolve),
            meta: { title: '自述文件' },
        },
        {
            path: '/public/event/box_taipei/match/:match_id',
            component: () => import('../components/page/event/box_taipei_20201025/show/match'),
            meta: { title: 'Box Taipei 20201025 Match' }
        },
        {
            path: '/public/event/box_taipei/match_32/:match_id',
            component: () => import('../components/page/event/box_taipei_20201025/show/match_32'),
            meta: { title: 'Box Taipei 20201025 Match 32' }
        },
        {
            path: '/public/event/box_taipei/scoreboard/:match_id/:screen',
            component: () => import('../components/page/event/box_taipei_20201025/show/score'),
            meta: { title: 'Box Taipei 20201025 Score' }
        },
        {
            path: '/public/league_matches/:competition/:lang',
            component: resolve => require(['../components/page/public_league_matches.vue'], resolve),
            meta: { title: 'League Match' }
        },
        {
            path: '/public/league_standings/:competition/:lang',
            component: resolve => require(['../components/page/public_league_standings.vue'], resolve),
            meta: { title: 'League Standings' }
        },
        {
            path: '/public/league_match_detail/:competition/:main_team/:lang',
            component: resolve => require(['../components/page/public_match_detail.vue'], resolve),
            meta: { title: 'League Match Detail' }
        },
        {
            path: '/public/league_live_channels/:competition/:lang',
            component: resolve => require(['../components/page/public_live_channels.vue'], resolve),
            meta: { title: 'League Live Channels' }
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home_without_sidebar.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/league_teams',
                    name: 'league_teams',
                    component: resolve => require(['../components/page/league_teams.vue'], resolve),
                    meta: { title:  'menus.league_teams' }
                }, 
                {
                    path: '/league_teams_edit',
                    name: 'league_teams_edit',
                    component: resolve => require(['../components/page/league_teams_edit.vue'], resolve),
                    meta: { title:  'menus.league_teams_edit' }
                }, 
                {
                    path: '/league_players',
                    component: resolve => require(['../components/page/league_players.vue'], resolve),
                    meta: { title:  'menus.league_players' }
                }, 
            ]
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/ts_setting',
                    component: () => import('../components/page/event/box_taipei_20201025/back/TS_setting'),
                    meta: { title: 'Test Setting' }
                },
                {
                    path: '/ts_setting_16',
                    component: () => import('../components/page/event/box_taipei_20201025/back/TS_setting_16'),
                    meta: { title: 'Box Taipei 20201025 [16] Test Setting' }
                },
                {
                    path: '/ts_setting_32',
                    component: () => import('../components/page/event/box_taipei_20201025/back/TS_setting_32'),
                    meta: { title: 'Box Taipei 20201025 [32] Test Setting' }
                },
                {
                    path: '/dt_setting',
                    component: () => import('../components/page/event/box_taipei_20201025/back/DT_setting'),
                    meta: { title: 'Box Taipei 20201025 DoubleTap Setting' }
                },
                {
                    path: '/ok_setting',
                    component: () => import('../components/page/event/box_taipei_20201025/back/OK_setting'),
                    meta: { title: 'Box Taipei 20201025 OverKill  Setting' }
                },
                {
                    path: '/competition_info',
                    component: resolve => require(['../components/page/competition_info.vue'], resolve),
                    meta: { title:  'menus.competition_info' }
                }, 
                {
                    path: '/competition_league_info',
                    component: resolve => require(['../components/page/competition_info.vue'], resolve),
                    meta: { title:  'menus.competition_league_info' }
                },
                {
                    path: '/competition_advance_info',
                    component: resolve => require(['../components/page/competition_info.vue'], resolve),
                    meta: { title:  'menus.competition_advance_info' }
                },
                {
                    path: '/competition_info_edit',
                    component: resolve => require(['../components/page/competition_info_edit.vue'], resolve),
                    meta: { title:  'menus.competition_info_edit' }
                }, 
                {
                    path: '/league_detail_setting',
                    component: resolve => require(['../components/page/league_detail_setting.vue'], resolve),
                    meta: { title:  'menus.league_detail_setting' }
                },
                {
                    path: '/league_teams_info',
                    name: 'league_teams_info',
                    component: resolve => require(['../components/page/league_teams_info.vue'], resolve),
                    meta: { title:  'menus.league_teams_info' }
                }, 
                {
                    path: '/league_players_info',
                    name: 'league_players_info',
                    component: resolve => require(['../components/page/league_players_info.vue'], resolve),
                    meta: { title:  'menus.league_players_info' }
                }, 
                {
                    path: '/league_teams_matches',
                    name: 'league_teams_matches',
                    component: resolve => require(['../components/page/league_teams_matches.vue'], resolve),
                    meta: { title:  'menus.league_teams_matches' }
                },
                {
                    path: '/league_matches_info',
                    name: 'league_matches_info',
                    component: resolve => require(['../components/page/league_matches_info.vue'], resolve),
                    meta: { title:  'menus.league_matches_info' }
                },
                {
                    path: '/league_live_channel',
                    name: 'league_live_channel',
                    component: resolve => require(['../components/page/league_live_channel.vue'], resolve),
                    meta: { title:  'menus.league_live_channel' }
                },  
                {
                    path: '/league_standing',
                    name: 'league_standing',
                    component: resolve => require(['../components/page/league_standing.vue'], resolve),
                    meta: { title:  'menus.league_standing' }
                }, 
                {
                    path: '/league_standing_info',
                    name: 'league_standing_info',
                    component: resolve => require(['../components/page/league_standing_info.vue'], resolve),
                    meta: { title:  'menus.league_standing_info' }
                },
                {
                    path: '/register_verify',
                    component: resolve => require(['../components/page/register_verify.vue'], resolve),
                    meta: { title:  'menus.register_verify' }
                },  
                {
                    path: '/competition_check_in',
                    component: resolve => require(['../components/page/competition_check_in.vue'], resolve),
                    meta: { title:  'menus.competition_check_in' }
                },   
                {
                    path: '/competition_group',
                    component: resolve => require(['../components/page/competition_group.vue'], resolve),
                    meta: { title:  'menus.competition_group' }
                },    
                {
                    path: '/competition_statistics',
                    component: resolve => require(['../components/page/competition_statistics.vue'], resolve),
                    meta: { title:  'menus.competition_statistics' }
                }, 
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
        {
            path: '/registration',  
            component: resolve => require(['@/components/registration/Home.vue'], resolve),
            meta: {
                title: ''
            },
            children: [
                {
                    path: 'signup_form',
                    component: resolve => require(['@/components/registration/SignupForm.vue'], resolve),
                    meta: {
                        title: ''
                    }
                }
            ]
        },
        {
            path: '/registration/finish',
            component: resolve => require(['@/components/registration/Finish.vue'], resolve),
            meta: {
                title: ''
            }
        }
    ]
})
