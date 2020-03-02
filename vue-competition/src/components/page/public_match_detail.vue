<template>
    <div class="scrollBar">
        <el-scrollbar
        ref="scroll" 
        wrap-class="list" 
        view-class="view-box" 
        :native="false" 
        style="height:102%;">
        <div class="middle_box">
            <div style="margin-bottom:-3vmin;height:7vmin;"></div>
            <div style="margin-bottom:-3vmin;">
                <div style="height:100%;">
                    <img width="100%" src="image/league/title/detail_pre.png"> 
                </div>
            </div>
        </div>
        </el-scrollbar>
    </div>
</template>
<script>
import {publicService} from "@/_services";
export default {
    name:"public_league_matches",
    components: {

    },

    data(){
        return{
            
        }
    },

    created(){
        this.getData();
    },

    computed: {
            
    },

    watch:{
        '$route.params.competition':{
            handler(newval, oldval){
                this.getData()
            },
        },

        '$route.params.main_team':{
            handler(newval, oldval){
                this.getData()
            },
        }
    },

    methods:{
        getData(){
            console.log(this.$route.params.competition, this.$route.params.main_team)
            this.$i18n.locale = this.$route.params.lang;
            publicService.get_match_game(this.$route.params.competition, this.$route.params.main_team)
            .then(res => { 
                
            });
        }
    }
}
</script>
<style scoped>
.middle_box{
    max-width:1000px;
    min-width:320px;
    margin:auto;
}
.column_font{
    font-family: "NotoSansCJKtc-Regular","Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    color:#ffffff;
}
.Num_font{
    font-family: "AvantGardeITCbyBT","Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    color:#ffffff;
}
.cursor-point{
    cursor:pointer;
}
.scrollBar{ 
    background-image:url('/image/league/bg/BG.jpg');
    background-repeat:no-repeat;
    background-position:center;
    background-size:cover;
    height:100%; 
    overflow:hidden;
    position:relative;   
} 
.list{ 
  max-height:10px; 
}
</style>