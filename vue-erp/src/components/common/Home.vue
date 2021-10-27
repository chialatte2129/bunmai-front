<template>
    <div class="wrapper" >
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}" >
            <div class="content" >
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view style="min-width:1000px;"></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
    </div>
</template>
<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';
import bus from './bus';
export default {
     data(){
        return {
            tagsList: [],
            collapse: false,
            screenWidth:document.body.clientWidth,
            screenHeight:document.documentElement.clientHeight,
        }
    },
    components:{
        vHead, vSidebar
    },
    watch:{
        screenWidth(val){
            if(!this.timer_w){
                this.screenWidth = val
                this.timer_w = true
                setTimeout(() => {
                    this.timer_w = false
                    bus.$emit("screen-width", this.screenWidth);
                }, 250)
            }
        },

        screenHeight(val){
            if(!this.timer_h){
                this.screenHeight = val
                this.timer_h = true
                setTimeout(() => {
                    this.timer_h = false
                    bus.$emit("screen-height", this.screenHeight);
                }, 250)
            }
        },
    },
    mounted(){
        window.onresize = () => {
            return (() => {
                window.screenWidth = document.body.clientWidth;
                window.screenHeight = document.documentElement.clientHeight;
                this.screenWidth = window.screenWidth;
                this.screenHeight = window.screenHeight;
            })()
        }
    },
    created(){
        bus.$on('collapse', msg => {
            this.collapse = msg;
        })
        
    }
}
</script>
<style>
.el-table--scrollable-x .el-table__body-wrapper {
    z-index : 1;
}
</style>