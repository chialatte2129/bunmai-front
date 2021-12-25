<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    //import vSidebar from './Sidebar.vue';
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
            vHead,vTags
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
<style>


/* @import "../../assets/css/bootstrap.min.css";
@import "../../assets/css/bootstrap-theme.min.css";
@import "../../assets/css/fontAwesome.css";
@import "../../assets/css/hero-slider.css";
@import "../../assets/css/tooplate-style.css"; */
.selector-for-some-widget{
    box-sizing:content-box;
}
#nav-scroller{
    background-color: #ebebeb;
    position:relative; 
    height:100%; 
    overflow-y:auto;
    overflow-x:auto;
}
.container{
    /* padding: 0%; */
    border: 0px;
    background-color: #f0f0f0;
}
.min-w-dl-msg-box{
    min-width:300px;
}
</style>
