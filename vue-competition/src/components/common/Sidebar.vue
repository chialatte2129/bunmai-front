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
                            <template slot="title">{{ subItem.title }}</template>
                            <el-menu-item
                            v-for="(threeItem,i) in subItem.subs"
                            :key="i"
                            :index="threeItem.index"
                            v-show="threeItem.show"
                            >{{ threeItem.title }}</el-menu-item>
                        </el-submenu>
                        <el-menu-item v-else :index="subItem.index" :key="subItem.index" v-show="subItem.show">{{ subItem.title }}</el-menu-item>
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
                    icon: "el-icon-info",
                    index: "competition_info",
                    title: this.$t("menus.competition_info"),
                    show: this.includeSubMenu([
                        "competition_advance_info",
                        "competition_league_info"
                    ]),
                    subs: [            
                        {
                            index: "competition_info?ctype=advance&page=1&row=0",
                            title: this.$t("menus.competition_advance_info"),
                            show: this.hasThisMenu("competition_advance_info")
                        },
                        {
                            index: "competition_league_manage",
                            title: this.$t("menus.competition_league_manage"),
                            show: this.includeSubMenu([
                                "competition_league_info"
                            ]),
                            subs:[
                                {
                                    index: "competition_info?ctype=league&page=1&row=0",
                                    title: this.$t("menus.competition_league_info"),
                                    show: this.hasThisMenu("competition_league_info")
                                },
                                {
                                    index: "league_detail_setting",
                                    title: this.$t("menus.league_detail_setting"),
                                    show: this.hasThisMenu("league_detail_setting")
                                },
                                {
                                    index: "league_teams",
                                    title: this.$t("menus.league_teams"),
                                    show: this.hasThisMenu("league_teams")
                                },
                                {
                                    index: "league_players",
                                    title: this.$t("menus.league_players"),
                                    show: this.hasThisMenu("league_players")
                                },
                            ]
                        },
                    ]
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
