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
    data(){
        return {
            collapse: false,        
            items: [                
                // Authority management
                {
                    icon: "el-icon-collection",
                    index: "project",
                    title: this.$t("menus.project_manage"),
                    show: this.includeSubMenu(["day_item_person", "day_item_review", "work_items"]),
                    subs: [            
                        {
                            index: "work_items",
                            title: this.$t("menus.work_items"),
                            show: this.hasThisMenu("work_items")
                        },
                        {
                            index: "daily_report",
                            title: this.$t("menus.daily_report"),
                            show: this.includeSubMenu([
                                "day_item_person", 
                                "day_item_review"
                            ]),
                            subs: [ 
                                {
                                    index: "day_item_person",
                                    title: this.$t("menus.day_item_person"),
                                    show: this.hasThisMenu("day_item_person")
                                },
                                {
                                    index: "day_item_review",
                                    title: this.$t("menus.day_item_review"),
                                    show: this.hasThisMenuOrMgr("day_item_review"),
                                },
                            ]
                        },
                    ]
                },
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
        onRoutes(){
            return this.$route.path.replace("/", "");
        }
    },
    methods: {
        hasThisMenu(menu_path){
            var my_menus = localStorage.getItem("ms_user_menus").split(",");
            if (my_menus.includes(menu_path)) {
                return true;
            } else {
                return false;
            }
        },

        hasThisMenuOrMgr(menu_path){
            var my_menus = localStorage.getItem("ms_user_menus").split(",");
            if (my_menus.includes(menu_path)) {
                return true;
            } else {
                if (localStorage.getItem("ms_odoo_is_dept_manager")=="true") {
                    localStorage.setItem("ms_user_menus", `${localStorage.getItem('ms_user_menus')}, ${menu_path}`); 
                    return true;
                }
            }
            return false;
        },

        includeSubMenu(sys_menus){
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
            return find_flag;
        }
    },

    created(){
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
