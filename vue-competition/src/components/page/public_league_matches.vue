<template>
    <div class="scrollBar" style="background-color:#333333;font-size:16px">
        <el-scrollbar
        ref="scroll" 
        wrap-class="list" 
        view-class="view-box" 
        :native="false" 
        style="height:102%;">
        <div class="middle_box">
            <div style="z-index:999;min-width:1000px;align:center;height:3vw;position:fixed;top:0;background:#333333;"></div>
            <div style="z-index:999;max-width:1000px;min-width:320px;align:center;height:auto;position:fixed;top:3vw;background:#333333;">
                <div style="height:100%;">
                    <img width="100%" src="image/league/test.png"> 
                </div>
                <div style="margin-top:1vw;position:relative;width:100%;padding-top:9%;">
                    <div style="position:absolute;width:100%;height:100%;top:0;left:0;">
                        <div style="float:left;width:40%;height:100%;display:flex;align-items:center;justify-content:center;background-color:#00C7EE;background:linear-gradient(to right, #00C7EE, #707070);
                        background-repeat:no-repeat;background-size:100%;background-position:center;">
                            <div class="column_font text-center"><p style="font-size:3vmin;">BLUE TEAM</p><p style="font-size:2.0vmin;">HOST</p></div>
                        </div>
                        <div style="float:left;width:20%;height:100%;display:flex;align-items:center;justify-content:center;background-color:#707070;background:radial-gradient(circle, #5D5D5D, #707070);
                        background-repeat:no-repeat;background-size:100%;background-position:center;">
                            <span class="column_font" style="font-size:3.5vmin;">DATE</span>
                        </div>
                        <div style="float:left;width:40%;height:100%;display:flex;align-items:center;justify-content:center;background-color:#FF1285;background:linear-gradient(to left, #FF1285, #707070);
                        background-repeat:no-repeat;background-size:100%;background-position:center;">
                            <div class="column_font text-center"><p style="font-size:3vmin;">RED TEAM</p><p style="font-size:2.0vmin;">Guest</p></div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="visibility:hidden;margin-bottom:4vw;top:3vw;">
                <div style="height:100%;">
                    <img width="100%" src="image/league/test.png"> 
                </div>
                <div style="margin-top:1vw;position:relative;width:100%;padding-top:8.6%">
                    <div style="position:absolute;width:100%;height:100%;top:0;left:0;">
                        <div style="float:left;width:15.8%;height:100%;display:flex;align-items:center;justify-content:center;">
                        </div>
                        <div style="float:left;width:51.2%;height:100%;display:flex;align-items:center;justify-content:center;">
                            <span class="column_font" style="font-size:3.7vmin;"></span>
                        </div>
                        <div style="float:left;width:10%;height:100%;display:flex;align-items:center;justify-content:center;">
                            <span class="column_font" style="font-size:3.5vmin;"></span>
                        </div>
                        <div style="float:left;width:10%;height:100%;display:flex;align-items:center;justify-content:center;">
                            <span class="column_font" style="font-size:3.5vmin;"></span>
                        </div>
                    </div>
                </div>  
            </div>
            <div v-for='(row, index) in match' class="round"> 
                <div style="position:absolute;width:100%;height:100%;top:0;left:0;">
                    <span style="display:inline;">
                        <div v-for='(row_rn, index_rn) in row.schedules' class="schedule_round"> 
                            {{row_rn}}
                        </div>
                    </span>
                </div>
                <div style="margin:5vw 0;"></div>
            </div>
            <div style="margin:5vw 0;"></div>
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
.text-center{
    text-align:center;
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
.round{
    position:relative;
    width:100%;
    padding-top:11.1%;
    margin-bottom:1vw;
}
.schedule_round{
    background-image:url('/image/league/EvenPanel.png');
    position:relative;
    margin:1vw;
    background-repeat:no-repeat;
    background-size:100%;
    background-position:center;
    background-color:#1C1C1C;
    height:100%;     
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