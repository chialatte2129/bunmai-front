<template>
    <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
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
            collapse: true,        
            items: [                
                // Authority management
                {
                    icon: "el-icon-s-shop",
                    index: "store_function",
                    title: "廣告商", 
                    show: true,   
                    subs: [
                        {
                            icon: "el-icon-s-data",
                            index: "deshboard_store",
                            title: "推廣成效-廣告商",
                            show: true
                        },
                        {
                            icon: "el-icon-goods",
                            index: "products",
                            title: "我的商品",
                            show: true
                        },
                    ]
                },
                {
                    icon: "el-icon-s-shop",
                    index: "kol_function",
                    title: "KOL",   
                    show: true, 
                    subs: [
                        {
                            icon: "el-icon-s-data",
                            index: "deshboard_KOL",
                            title: "推廣成效-KOL",
                            show: true
                        },
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
            console.log(msg);
        this.collapse = msg;
        });
    }
};
</script>
<style>
.content-collapse {
    left: 0px;
    background-color:#f0f2f5;
}
.content {
    background-color:#f0f2f5;
}
</style>
<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.el-menu--collapse {
    width: 0px;
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
