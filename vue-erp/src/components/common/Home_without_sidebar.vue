<template>
    <div class="wrapper" style="min-width:1820px;">
        <v-head></v-head>
        <div class="content-box" :class="{'content-collapse':collapse}" >
            <div class="content" >
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view style="min-width:1720px;"></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import vHead from './Header_without_sidebar.vue';
    import vTags from './Tags.vue';
    import bus from './bus';
    export default {
        data(){
            return {
                tagsList: [],
                collapse: false
            }
        },
        components:{
            vHead, vTags
        },
        created(){
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
            // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
            bus.$on('tags', msg => {
                let arr = [];
                for(let i = 0, len = msg.length; i < len; i ++){
                    msg[i].name && arr.push(msg[i].name);
                }
                this.tagsList = arr;
            })
        }
    }
</script>
<style scoped>
.content{
    padding:10px 30px;
}
.content-box{
    left:0;
}
</style>