<template>
    <div class="wrapper" style="background-color:#f0f2f5" ref="content" id="nav-scroller">
        <transition name="move" mode="out-in">
            <keep-alive :include="tagsList">
                <router-view ></router-view>
            </keep-alive>
        </transition>
    </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
export default {
    data(){
        return {
            tagsList: [],
            collapse: false
        }
    },
    components:{
        
    },
    created(){
       
    }
}
</script>
<style>
.selector-for-some-widget{
    box-sizing:content-box;
}
#nav-scroller{
    background-color: #ebebeb;
    position:relative; 
    height:100%; 
    overflow-y:auto;
}
.container{
    /* padding: 0%; */
    border: 0px;
    background-color: #f0f2f5;
}
.min-w-dl-msg-box{
    min-width:300px;
}
</style>
