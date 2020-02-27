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
            </div>
            <div style="visibility:hidden;margin-bottom:4vw;top:3vw;">
                <div style="height:100%;">
                    <img width="100%"  src="image/league/test.png"> 
                </div>
            </div>
            <div style="position:relative;width:100%;display:flex;align-items:center;justify-content:center;font-size:3.7vmin;margin:0.5vw 0 2.5vw 0;" class="column_font">
                {{$t('game_info.league.online_streaming')}}
            </div>
            <div>
                <div v-for='(row, index) in channels' style="float:left;width:80%;height:100%;display:flex;align-items:center;justify-content:center;">
                    <div class="column_font" style="position:relative;width:100%;height:100%;top:0;left:0;margin:3vw 0;">
                        <div style="margin-bottom:1vw;font-size:4vmin">
                            <span style="margin-left:15%;">{{row.year}} / {{row.month}} / {{row.day}}</span>
                            <span style="margin-left:5vw;width:100%;">{{row.start_time}}</span>
                        </div>
                        <div v-for='(row_team, index_team) in row.game_channels' class="background_deep" style="font-size:3vmin;">
                            <div style="position:absolute;width:100%;height:100%;top:0;left:0;">
                                <div style="z-index:2;float:left;width:3%;height:100%;display:flex;align-items:center;justify-content:center;"> </div>
                                <div style="z-index:2;float:left;width:40%;height:100%;display:flex;align-items:center;justify-content:center;">
                                    <div class="column_font" style="font-size:3vmin;color:white;">{{row_team.team_name}}</div>
                                </div>
                                <div style="z-index:2;float:left;width:57%;height:100%;display:flex;align-items:center;justify-content:left;">
                                    <span v-for='(row_ch, index_ch) in row_team.channels'>
                                        <span :class="'ch_'+index+index_team+index_ch" @click="pushChannels(row_ch)" 
                                        @mouseenter="mouseEnter(`${index.toString()}${index_team.toString()}${index_ch.toString()}`)"
                                        @mouseleave="mouseLeave(`${index.toString()}${index_team.toString()}${index_ch.toString()}`)">
                                            <i class="el-icon-folder" style="margin-right:1vw;"></i>
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style="margin:5vw 0;"></div>
                    </div>
                </div>
            </div>
        </div>
        </el-scrollbar>
    </div>
</template>
<script>
import {publicService} from "@/_services";
export default {
    name:"public_live_channels",
    components: {

    },

    data(){
        return{
            channels:[],
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
        mouseEnter(num){
            var el = document.querySelector(`.ch_${num}`);
            el.classList.add("cursor-point");
        },

        mouseLeave(num){
            var el = document.querySelector(`.ch_${num}`);
            el.classList.remove("cursor-point");
        },

        pushChannels(row){
            window.open(row);
        },
        
        getData(){
            publicService.get_channel_game(this.$route.params.competition)
            .then(res => { 
                if(res.code==1){
                    this.channels=res.live_channels;
                }
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
.column_font {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    color:#ffffff;
}
.scrollBar{ 
    height:100%; 
    overflow:hidden;
    position:relative;   
} 
.list{ 
  max-height:10px; 
}
.background_deep{
    /* background-image:url('/image/league/EvenPanel.png'); */
    position:relative;
    width:100%;
    padding-top:11%;
    margin:1vw 12.5%;
    background-repeat:no-repeat;
    background-size:100%;
    background-position:center;
    background-color:#1C1C1C;
    z-index:1;
}
.cursor-point{
    cursor:pointer;
}
</style>