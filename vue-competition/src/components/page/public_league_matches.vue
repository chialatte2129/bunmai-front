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
                        <div style="float:left;width:42.5%;height:100%;display:flex;align-items:center;justify-content:center;background-color:#00C7EE;background:linear-gradient(to right, #00C7EE, #707070);
                        background-repeat:no-repeat;background-size:100%;background-position:center;">
                            <div class="column_font text-center"><p style="font-size:3vmin;">BLUE TEAM</p><p style="font-size:2.0vmin;">HOST</p></div>
                        </div>
                        <div style="float:left;width:15%;height:100%;display:flex;align-items:center;justify-content:center;background-color:#707070;background:radial-gradient(circle, #5D5D5D, #707070);
                        background-repeat:no-repeat;background-size:100%;background-position:center;">
                            <span class="column_font" style="font-size:3vmin;">DATE</span>
                        </div>
                        <div style="float:left;width:42.5%;height:100%;display:flex;align-items:center;justify-content:center;background-color:#FF1285;background:linear-gradient(to left, #FF1285, #707070);
                        background-repeat:no-repeat;background-size:100%;background-position:center;">
                            <div class="column_font text-center"><p style="font-size:3vmin;">RED TEAM</p><p style="font-size:2.0vmin;">Guest</p></div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="visibility:hidden;margin-bottom:5vw;top:3vw;">
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
            <div v-for='(row, index) in match' :class="`round_${index}`" class="round">
                <div v-for='(row_rn, index_rn) in row.schedules' :class="`item_${index}${index_rn}`" class="item">
                    <div style="position:absolute;width:100%;height:100%;top:0;left:0;">
                        <div style="position:relative;float:left;width:6%;height:100%;text-align:center;display:flex;align-items:center;justify-content:center;">
                            <span class="column_font" style="font-size:3vmin;"></span>
                        </div>
                        <div style="position:relative;float:left;width:27%;height:100%;text-align:center;display:flex;align-items:center;justify-content:center;">
                            <span class="column_font" style="font-size:3vmin;">{{row_rn.home}}</span>
                        </div>
                        <div style="position:relative;float:left;width:31%;height:100%;text-align:center;display:flex;align-items:center;justify-content:center;">
                            <span class="column_font" style="font-size:3vmin;"></span>
                        </div>
                        <div style="position:relative;float:left;width:33%;height:100%;text-align:center;display:flex;align-items:center;justify-content:center;">
                            <span class="column_font" style="font-size:3vmin;">{{row_rn.away}}</span>
                        </div>
                    </div>
                </div>
                <div style="position:absolute;width:100%;height:100%;display:flex;align-items:center;justify-content:center;top:-1.0vw;left:-47%;transform:rotate(90deg);">
                    <hr style="margin:1.5vw;border:0;height:0.2vw;width:30%;background-image:linear-gradient(to right, #333333, rgba(255,195,34,1), #333333);"></hr>
                </div>
                <div style="position:absolute;width:100%;height:100%;display:flex;align-items:center;justify-content:center;top:-1.0vw;left:-49%;transform:rotate(90deg);">
                    <div class="column_font text-center">
                        <p style="font-size:2vmin;">WEEK {{row.round}}</p>
                    </div>
                </div>
                <div style="position:absolute;width:100%;height:100%;display:flex;align-items:center;justify-content:center;top:-1.0vw;">
                    <div class="column_font text-center" style="color:#FFC322;"><p style="font-size:3vmin;">V S</p><p style="font-size:2vmin;">{{row.month}} / {{row.day}}</p></div>
                </div>
                <hr style="margin:1.5vw;border:0;height:0.5vw;background-image:linear-gradient(to right, #333333, rgba(255,255,255,0.75), #333333);"></hr>
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
.round{
    position:relative;
}
.item{
    background-image:url('/image/league/EvenPanel.png');
    position:relative;
    margin:1vw 2vw;
    padding:3%;
    background-repeat:no-repeat;
    background-size:cover;
    background-position:center;
    background-color:#1C1C1C;
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