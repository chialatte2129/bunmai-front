<template>
    <div class="sidebar">
    <el-menu
    class="sidebar-el-menu"
    :default-active="onRoutes"
    :collapse="collapse"
    unique-opened
    router>
        <template v-for="item in items">
            <template v-if="item.subs">
                <el-submenu :index="item.index" :key="item.index" v-show="item.show">
                    <template slot="title">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </template>
                    <template v-for="subItem in item.subs">
                        <el-submenu
                            v-if="subItem.subs"
                            :index="subItem.index"
                            :key="subItem.index"
                            v-show="subItem.show">
                            <template slot="title"><i :class="subItem.icon"></i>{{ subItem.title }}</template>
                            <el-menu-item
                            v-for="(threeItem,i) in subItem.subs"
                            :key="i"
                            :index="threeItem.index"
                            v-show="threeItem.show"
                            >{{ threeItem.title }}</el-menu-item>
                        </el-submenu>
                        <el-menu-item v-else :index="subItem.index" :key="subItem.index" v-show="subItem.show"><i :class="subItem.icon"></i>{{ subItem.title }}</el-menu-item>
                    </template>
                </el-submenu>
            </template>
        <template v-else>
            <el-menu-item :index="item.index" :key="item.index" v-show="item.show">
                <i :class="item.icon"></i>
                <span slot="title">{{ item.title }}</span>
            </el-menu-item>
        </template>
        </template>
    </el-menu>
  </div>
</template>
<script>
import bus from "../common/bus";
export default {
    data() {
        return {
            collapse: false,        
            items: [
                // Competition info management
                {
                    icon: "el-icon-warning-outline",
                    index: "competition_league_info",
                    title: this.$t("menus.competition_league_info"),
                    show: this.includeSubMenu([
                        "competition_league_info",
                        "league_teams_info",
                        "league_matches_info",
                    ]),
                    subs: [    
                        {
                            icon: "el-icon-warning-outline",
                            index: "competition_info?ctype=league&page=1&row=0",
                            title: this.$t("menus.competition_info"),
                            show: this.hasThisMenu("competition_league_info")
                        },
                        {
                            icon: "el-icon-collection",
                            index: "league_teams_info?page=1&row=0",
                            title: this.$t("menus.league_teams_info"),
                            show: this.hasThisMenu("league_teams_info")
                        },
                        {
                            icon: "el-icon-user",
                            index: "league_players_info?page=1&row=0",
                            title: this.$t("menus.league_players_info"),
                            show: this.hasThisMenu("league_players_info")
                        },
                        {
                            icon: "el-icon-c-scale-to-original",
                            index: "league_matches_info?page=1&row=0",
                            title: this.$t("menus.league_matches_info"),
                            show: this.hasThisMenu("league_matches_info")
                        },
                        {
                            icon: "el-icon-s-operation",
                            index: "league_standing_info",
                            title: this.$t("menus.league_standing_info"),
                            show: this.hasThisMenu("league_standing_info")
                        },
                    ]
                },
                {
                    icon: "el-icon-info",
                    index: "competition_advance_info",
                    title: this.$t("menus.competition_advance_info"),
                    show: this.includeSubMenu([
                        "competition_advance_info",
                        "register_verify",
                        "competition_check_in",
                        "competition_group",
                        "competition_statistics",
                    ]),
                    subs: [
                        {
                            icon: "el-icon-warning-outline",
                            index: "competition_info?ctype=advance&page=1&row=0",
                            title: this.$t("menus.competition_info"),
                            show: this.hasThisMenu("competition_advance_info")
                        },
                        // Registration Form Verify management
                        {
                            icon: "el-icon-edit-outline",
                            index: "register_verify",
                            title: this.$t("menus.register_verify"),
                            show: this.hasThisMenu("register_verify")
                        },
                        // Competition Check In management
                        {
                            icon: "el-icon-circle-check",
                            index: "competition_check_in",
                            title: this.$t("menus.competition_check_in"),
                            show: this.hasThisMenu("competition_check_in")
                        },
                        // Competition Group management
                        {
                            icon: "el-icon-set-up",
                            index: "competition_group",
                            title: this.$t("menus.competition_group"),
                            show: this.hasThisMenu("competition_group")
                        },
                        // Competition Statistics management
                        {
                            icon: "el-icon-monitor",
                            index: "competition_statistics",
                            title: this.$t("menus.competition_statistics"),
                            show: this.hasThisMenu("competition_statistics")
                        },
                    ]
                },
                {
                    icon: "el-icon-trophy-1",
                    index: "event_box_taipei_20201025",
                    title: this.$t("menus.event_box_taipei_20201025"),
                    show: this.includeSubMenu([
                        "TS_setting",
                        "TS_setting_16",
                        "TS_setting_32",
                        "DT_setting",
                        "OK_setting",
                    ]),
                    subs: [
                        {
                            icon: "el-icon-loading",
                            index: "TS_setting",
                            title: this.$t("menus.TS_setting"),
                            show: this.hasThisMenu("TS_setting")
                        },
                        {
                            icon: "el-icon-loading",
                            index: "TS_setting_16",
                            title: this.$t("menus.TS_setting_16"),
                            show: this.hasThisMenu("TS_setting_16")
                        },
                        {
                            icon: "el-icon-loading",
                            index: "TS_setting_32",
                            title: this.$t("menus.TS_setting_32"),
                            show: this.hasThisMenu("TS_setting_32")
                        },
                        {
                            icon: "el-icon-aim",
                            index: "DT_setting",
                            title: this.$t("menus.DT_setting"),
                            show: this.hasThisMenu("DT_setting")
                        },
                        {
                            icon: "el-icon-s-flag",
                            index: "OK_setting",
                            title: this.$t("menus.OK_setting"),
                            show: this.hasThisMenu("OK_setting")
                        },
                    ],
                },
                
                // Authority management
                {
                    icon: "el-icon-lx-lock",
                    index: "acl",
                    title: this.$t("menus.acl"),
                    show: this.includeSubMenu(["user_edit","role_edit","dictionary_setting"]),
                    subs: [            
                        {
                            index: "user_edit",
                            title: this.$t("menus.user_edit"),
                            show: this.hasThisMenu("user_edit")
                        },
                        {
                            index: "role_edit",
                            title: this.$t("menus.role_edit"),
                            show: this.hasThisMenu("role_edit")
                        },
                        
                        {
                            index: 'dictionary_setting',
                            title: this.$t("menus.dict_setting"),
                            show: this.hasThisMenu("dictionary_setting")
                        }
                    ]
                },
                {
                    icon: "el-icon-lx-warn",
                    index: "7",
                    title: "錯誤處理",
                    show: false,
                    subs: [
                        {
                            index: "permission",
                            title: "權限測試",
                            show: true
                        },
                        {
                            index: "404",
                            title: "404頁面",
                            show: true
                        }
                    ]
                }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace("/", "");
        }
    },
    methods: {
        hasThisMenu(menu_path) {
            var my_menus = localStorage.getItem("ms_user_menus").split(",");
            if (my_menus.includes(menu_path)) {
                return true;
            } else {
                return false;
            }
        },
        includeSubMenu(sys_menus) {
            var find_flag = false;
            var arrayLength = sys_menus.length;
            var my_menus = localStorage.getItem("ms_user_menus").split(",");
            for (var i = 0; i < arrayLength; i++) {
                var menu_path = sys_menus[i];
                if (my_menus.includes(menu_path)) {
                    find_flag = true;
                    break;
                }
            }
            //console.log(sys_menus,find_flag)
            return find_flag;
        }
    },

    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on("collapse", msg => {
        this.collapse = msg;
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
