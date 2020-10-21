<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-s-flag"></i> {{$t("menus.event_box_taipei_20201025")}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t("menus.OK_setting")}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-card shadow="hover" body-style="padding:10px" class="mgb10">

            </el-card>
        </div>
    </div>
</template>
<script>
import { eventService } from "@/_services";
export default {
    name:"OK_setting",
    components: {

    },

    data(){
        return {
            match_id:"MATCH-OK-2020-10-25",
            
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
</style>