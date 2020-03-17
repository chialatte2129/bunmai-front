<template>
    <div class="scrollBar">
        <el-scrollbar
        ref="scroll" 
        wrap-class="list" 
        view-class="view-box" 
        :native="false" 
        style="height:102%;">
        <div class="middle_box">
            <div style="margin-bottom:-3vmin;height:11.5vmin;">
                <div style="height:100%;position:relative;">
                    <div style="position:absolute;top:1vmin;z-index:99999;display:flex;align-items:center;justify-content:center;">
                        <img width="10%" src="image/league/other/return_logo.png" class="return-logo" @click="closeWin" @mouseenter="mouseEnterReturn()" @mouseleave="mouseLeaveReturn()">
                    </div>
                </div>
            </div>
            <div style="margin-bottom:-3vmin;">
                <div style="height:100%;position:relative;">
                    <img width="100%" src="image/league/title/live_win.png">
                </div>
            </div>
            <div style="position:relative;width:100%;display:flex;align-items:center;justify-content:center;font-size:3.7vmin;margin:3vmin 0;" class="column_font">
                {{$t('game_info.league.online_streaming')}}
            </div>
            <div>
                <div v-for='(row, index) in channels' style="float:left;width:100%;height:100%;display:flex;align-items:center;justify-content:center;" v-if="channels!=[]">  
                    <div class="Num_font" style="position:relative;width:100%;height:100%;top:0;left:0;">
                        <div style="margin-bottom:1vmin;font-size:4vmin">
                            <span style="margin-left:15%;">{{row.year}} / {{row.month}} / {{row.day}}</span>
                            <!-- <span style="margin-left:5vmin;width:100%;">{{row.start_time}}</span> -->
                        </div>
                        <div v-for='(row_team, index_team) in row.game_channels' class="channel_row" style="font-size:3vmin;">
                            <div style="position:absolute;width:100%;height:100%;top:0;left:0;">
                                <div style="float:left;width:13%;height:100%;display:flex;align-items:center;justify-content:center;"> </div>
                                <div style="float:left;width:1%;height:100%;display:flex;align-items:center;justify-content:center;background-size:80%;
                                background-repeat:no-repeat;background-image:url('image/league/channel/date_title.png');background-position:center;"></div>
                                <div style="float:left;width:4%;height:100%;display:flex;align-items:center;justify-content:center;"> </div>
                                <div style="float:left;width:32%;height:100%;display:flex;align-items:center;justify-content:left;">
                                    <div class="column_font" style="font-size:3vmin;color:white;">{{row_team.team_name}}</div>
                                </div>
                                <div style="float:left;width:40%;height:100%;display:flex;align-items:center;justify-content:left;">
                                    <span v-for='(row_ch, index_ch) in row_team.channels'>
                                        <span :class="'ch_'+index+index_team+index_ch" @click="pushChannels(row_ch)" style="display:flex;align-items:center;justify-content:left;"
                                        @mouseenter="mouseEnter(`${index.toString()}${index_team.toString()}${index_ch.toString()}`)"
                                        @mouseleave="mouseLeave(`${index.toString()}${index_team.toString()}${index_ch.toString()}`)">
                                            <img class="channel-img" width="95vmin;" :src="channel_img(index_ch+1)">
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <img v-if="index!=(hr_check-1)" style="margin:4% 10%;" width="80%" src="image/league/channel/hr_line.png">
                    </div>
                </div>
            </div>
            <div style="margin:5vmin 0;color:transparent;"> VR LIVE</div>
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
                this.getData()
            },
        }
    },

    methods:{
        closeWin(){
            var win = window.open('', '_self', '');
            win.close();
        },

        mouseEnterReturn(){
            var el = document.querySelector(".return-logo");
            el.classList.add("cursor-point");
        },

        mouseLeaveReturn(){
            var el = document.querySelector(".return-logo");
            el.classList.remove("cursor-point");
        },

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
        
        channel_img(num){
            return `image/league/channel/Var-Live-Logo_ch_${num.toString()}.png`
        },
        
        getData(){
            this.$i18n.locale = this.$route.params.lang;
            publicService.get_channel_game(this.$route.params.competition)
            .then(res => {
                if(res.code==1){
                    this.channels=res.live_channels;
                    this.hr_check=res.live_channels.length;
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
.column_font{
    font-family: "NotoSansCJKtc-Regular","Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    color:#ffffff;
}
.Num_font{
    font-family: "AvantGardeITCbyBT","Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    color:#ffffff;
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
.channel_row{
    background-image:url('/image/league/channel/rows.png');
    position:relative;
    width:100%;
    padding-top:9%;
    margin:-1vmin 0;
    background-repeat:no-repeat;
    background-size:100%;
    background-position:center;
}
.cursor-point{
    cursor:pointer;
}
.channel-img{
    margin:0 1vmin;
    max-width:95px;
}
@media(max-width:500px){
.channel-img{
    margin:0 1vmin;
    max-width:85px;
}
}
@media(max-width:400px){
.channel-img{
    margin:0 1vmin;
    max-width:75px;
}
}
</style>