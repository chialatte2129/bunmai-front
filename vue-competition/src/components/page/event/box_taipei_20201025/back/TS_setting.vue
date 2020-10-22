<template>
    <div class="setting-page">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-aim"></i> {{$t("menus.event_box_taipei_20201025")}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t("menus.TS_setting")}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
        </div>
    </div>
</template>
<script>
import teamManage from "./team_manage.vue";
import scoreBoard from "./score_board.vue";
import { eventService } from "@/_services";
export default {
    name:"TS_setting",
    components: {
        teamManage,
        scoreBoard
    },

    data(){
        return {
            
        }
    },
    computed: {
        
    },

    watch: {
        
    },

    created(){
        
    },

    methods:{

    }
}
</script>
<style scoped>
    .mgb10{
        margin-bottom:10px;
    }
    .mgr10{
        margin-right:10px;
    }
    .mgl10{
        margin-left:10px;
    }
    .container{
        background-color:#f0f0f0;
        padding:25px;
    }
    .crumbs >>> .el-breadcrumb{
        font-size: 20px;
        height: 25px;
    }
    .clearfix{
        line-height:1.23;
    }
    .card-header-r-btn{
        position:relative;
        float:right;
        margin:-10px -10px 0 0;
    }
    .card-header-btn{
        position:relative;
        float:right;
        margin:-10px 10px 0 0;
    }
</style>