<template>
    <div class="scrollBar" style="background-color:#333333;font-size:16px">
        <el-scrollbar
        ref="scroll" 
        wrap-class="list" 
        view-class="view-box" 
        :native="false" 
        style="height:102%;">
        <div class="middle_box">
            <div style="z-index:999;max-width:1000px;min-width:320px;align:center;height:auto;position:fixed;top:3vw;background:#333333;">
                <div style="height:100%;">
                    <img width="100%" src="image/league/test.png" @click=""> 
                </div>
                <div style="margin:5px 0 7px 0;position:relative;width:100%;padding-top:8.6%;background-repeat:no-repeat;
                background-image:url('image/league/TitlePanel.png');background-size:100%;background-position:center;">
                    <div style="position:absolute;width:100%;height:100%;top:0;left:0;">
                        <div style="float:left;width:15.8%;height:100%;display:flex;align-items:center;justify-content:center;">
                            <span class="column_font" style="font-size:3.7vmin;">RANK</span>
                        </div>
                        <div style="float:left;width:51.2%;height:100%;display:flex;align-items:center;justify-content:center;">
                            <span class="column_font" style="font-size:3.7vmin;">TEAM</span>
                        </div>
                        <div style="float:left;width:10%;height:100%;display:flex;align-items:center;justify-content:center;">
                            <span class="column_font" style="font-size:3.5vmin;"></span>
                        </div>
                        <div style="float:left;width:10%;height:100%;display:flex;align-items:center;justify-content:center;">
                            <span class="column_font" style="font-size:3.5vmin;">POINT</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </el-scrollbar>
    </div>
</template>
<script>
import Vue from "vue";
import {publicService} from "@/_services";
export default {
    name:"public_league_standings",
    components: {
        
    },

    data(){
        return{
            game_name:"",
            match:[],
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
        '$route.params.lang':{
            handler(newval, oldval){
                this.$i18n.locale = this.$route.params.lang;
                this.getData()
            },
        }
    },

    methods:{
        getData(){
            publicService.get_match_game(this.$route.params.competition)
            .then(res => { console.log(res)
                if(res.code==1){
                    this.game_name = res.game_name;
                    this.match = res.matches;
                }
            });
        }
    }
}
</script>
<style scoped>
.middle_box {
    max-width:1000px;
    min-width:320px;
    margin:auto;
}
.column_font {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    color:#ffffff;
}
.game-name-font{
    color:#000000!important;
}
.el-table .common-row {
    background : PeachPuff;
}
.border-line{
    border-bottom:0.1vmin #000000 solid;
}
.game-name-border{
    border-top:0.1vmin #000000 solid;
    border-bottom:0.1vmin #000000 solid;
}
.background_deep{
    background-image:url('/image/league/EvenPanel.png');
    position:relative;
    width:100%;
    padding-top:11.1%;
    margin-bottom:1vw;
    background-repeat:no-repeat;
    background-size:100%;
    background-position:center;
}
.cursor-point{
    cursor:pointer;
}
.scrollBar{ 
    /* background-image:url('/image/league/QRCode_BG.png');
    background-repeat:no-repeat;
    background-position:center; */
    height:100%; 
    overflow:hidden;
    position:relative;   
} 
.list{ 
  max-height:10px; 
}
</style>