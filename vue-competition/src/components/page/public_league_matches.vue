<template>
    <div class="scrollBar" style="background-color:#333333;">
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
                    <img width="100%" src="image/league/title/match_list_pre.png"> 
                </div>
                <div style="position:relative;width:94%;padding-top:20%;margin-left:3%;background-repeat:no-repeat;
                background-image:url('image/league/match/matches.png');background-size:110%;background-position:center;">
                    <div style="position:absolute;width:100%;height:100%;top:-1vmin;left:0;">
                        <div style="float:left;width:42.5%;height:100%;display:flex;align-items:center;justify-content:center;">
                            <div class="column_font text-center"><p style="font-size:3vmin;"><b>BLUE TEAM</b></p><p style="font-size:2.0vmin;">HOST</p></div>
                        </div>
                        <div style="float:left;width:15%;height:100%;display:flex;align-items:center;justify-content:center;">
                            <span class="column_font" style="font-size:3vmin;">DATE</span>
                        </div>
                        <div style="float:left;width:42.5%;height:100%;display:flex;align-items:center;justify-content:center;">
                            <div class="column_font text-center"><p style="font-size:3vmin;"><b>RED TEAM</b></p><p style="font-size:2.0vmin;">GUEST</p></div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-for='(row, index) in match' :class="`round_${index}`" class="round">
                <div style="position:absolute;width:100%;height:100%;display:flex;align-items:center;justify-content:center;top:-1.0vmin;left:-47%;transform:rotate(90deg);">
                    <hr style="z-index:100;margin:1.5vmin;border:0;height:0.5vmin;width:30vmin;background-image:linear-gradient(to right, transparent, rgba(255,195,34,1), transparent);"></hr>
                </div>
                <div v-for='(row_rn, index_rn) in row.schedules' :class="`item_${index}${index_rn}`" class="item">
                    <div style="position:absolute;margin-left:2%;width:96%;height:100%;top:0;left:0;
                    background-repeat:no-repeat;background-image:url('image/league/match/rows.png');background-size:100%;background-position:center;"></div>                
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
                <div style="position:absolute;width:100%;height:100%;display:flex;align-items:center;justify-content:center;top:-1.5vmin;left:-49%;transform:rotate(90deg);">
                    <div class="column_font text-center" style="font-size:2vmin;">
                        <p>Week<span class="Num_font" style="font-size:2vmin;"> {{row.round}}</span></p>
                    </div>
                </div>
                <div style="position:absolute;width:100%;height:100%;display:flex;align-items:center;justify-content:center;top:-3vmin;">
                    <div class="column_font text-center" style="color:#E3DB70;">
                        <!-- <img width="100vmin" src="image/league/match/vs.png"> -->
                        <p style="font-size:6vmin;">V S</p>
                        <p style="font-size:4vmin;color:#E3DB70;" class="Num_font">{{row.month}} / {{row.day}}</p>
                    </div>
                </div>
                <img v-if="index!=(hr_check-1)" style="margin-left:10%;" width="80%" src="image/league/match/hr_line.png">
            </div>
            <div style="margin:5vmin 0;"></div>
        </div>
        </el-scrollbar>
    </div>
</template>
<script>
import Vue from "vue";
import {publicService} from "@/_services";
export default {
    name:"public_league_matches",
    components: {
        
    },

    data(){
        return{
            game_name:"",
            match:[],
            hr_check:null,
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
            this.$i18n.locale = this.$route.params.lang;
            publicService.get_match_game(this.$route.params.competition)
            .then(res => { 
                if(res.code==1){
                    this.game_name = res.game_name;
                    this.match = res.matches;
                    this.hr_check=res.matches.length;
                }
            });
        }
    }
}
</script>
<style scoped>
.text-center{
    text-align:center;
}
.round{
    position:relative;
    width:95%;
    margin-left:2.5%;
}
.item{
    position:relative;
    margin:1vmin 2.5vmin;
    padding:3%;
}
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
.standing{
    position:relative;
    width:100%;
    padding-top:11.1%;
    margin-bottom:-1vmin;
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