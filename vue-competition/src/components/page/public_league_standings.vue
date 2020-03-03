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
                    <img width="100%" src="image/league/title/standing_pre.png" @click="reGetData"> 
                </div>
                <div style="margin:5px 2%;position:relative;width:96%;padding-top:8.6%;background-repeat:no-repeat;
                background-image:url('image/league/standing/titlePanel.png');background-size:95%;background-position:center;">
                    <div style="position:absolute;width:100%;height:100%;top:0;left:0;">
                        <div style="float:left;width:8%;height:100%;display:flex;align-items:center;justify-content:center;"></div>
                        <div style="float:left;width:17%;height:100%;display:flex;align-items:center;justify-content:center;">
                            <span class="column_font" style="font-size:3vmin;">RANK</span>
                        </div>
                        <div style="float:left;width:40%;height:100%;display:flex;align-items:center;justify-content:center;">
                            <span class="column_font" style="font-size:3vmin;">TEAM</span>
                        </div>
                        <div style="float:left;width:10%;height:100%;display:flex;align-items:center;justify-content:center;">
                            <span class="column_font" style="font-size:3vmin;"></span>
                        </div>
                        <div style="float:left;width:10%;height:100%;display:flex;align-items:center;justify-content:center;">
                            <span class="column_font" style="font-size:3vmin;">POINT</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-for='(row, index) in ranks' class="standing">  
                <div v-if='index==0' style="position:absolute;width:100%;height:100%;top:0;left:0;
                background-repeat:no-repeat;background-image:url('image/league/standing/1stPanel.png');background-size:100%;background-position:center;"></div> 
                <div v-else-if='index==1' style="position:absolute;width:100%;height:100%;top:0;left:0;
                background-repeat:no-repeat;background-image:url('image/league/standing/2ndPanel.png');background-size:100%;background-position:center;"></div> 
                <div v-else-if='index==2' style="position:absolute;width:100%;height:100%;top:0;left:0;
                background-repeat:no-repeat;background-image:url('image/league/standing/3rdPanel.png');background-size:100%;background-position:center;"></div>   
                <div v-else style="position:absolute;width:100%;height:100%;top:0;left:0;
                background-repeat:no-repeat;background-image:url('image/league/standing/normalPanel.png');background-size:92%;background-position:center;opacity:0.2;"></div>
                <div style="position:absolute;width:100%;height:100%;top:0;left:0;">
                    <div style="float:left;width:13.3%;height:100%;display:flex;align-items:center;justify-content:center;"></div>
                    <div style="float:left;width:11.7%;height:100%;display:flex;align-items:center;justify-content:center;">
                        <span class="Num_font" style="font-size:5vmin;color:white;" v-if='row.rank!=1&&row.rank!=2&&row.rank!=3'>{{row.rank}}</span>
                    </div>
                    <div style="float:left;width:40%;height:100%;text-align:left;display:flex;align-items:center;justify-content:center;">
                        <span class="column_font" style="float:left;font-size:3.5vmin;color:white;">{{row.team_name}}</span>
                    </div>
                    <div style="float:left;width:10%;height:100%;display:flex;align-items:center;justify-content:center;">
                        <span class="column_font" style="font-size:3.5vmin;"></span>
                    </div>
                    <div style="float:left;width:10%;height:100%;display:flex;align-items:center;justify-content:center;">
                        <span class="Num_font" style="font-size:3.5vmin;color:white;">{{row.scores}}</span>
                    </div>
                    <div style="float:left;width:13%;height:100%;display:flex;align-items:center;justify-content:center;">
                        <span class="column_font" style="font-size:3vmin;"><span :class="`search_${index}`" @click="pushDetail(row)" @mouseenter="mouseEnter(index)" @mouseleave="mouseLeave(index)">
                            <i class="el-icon-search"></i></span>
                        </span>
                    </div>
                </div>
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
    name:"public_league_standings",
    components: {
        
    },

    data(){
        return{
            ranks:[],
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
        pushDetail(row){
            window.open(`${process.env.VUE_APP_HOST}public/league_match_detail/${this.$route.params.competition}/${row.team_id}/${this.$route.params.lang}`);
        },

        normalPanel(index){
            if(index==0||index==1||index==2){
                return ""
            }else{
                return "normalPanel"
            }
        },

        mouseEnter(index){
            var el = document.querySelector(`.search_${index}`);
            el.classList.add("cursor-point");
        },
        
        mouseLeave(index){
            var el = document.querySelector(`.search_${index}`);
            el.classList.remove("cursor-point");
        },

        reGetData(){
            const loading = this.$loading({
                lock:true,
                spinner:"el-icon-loading",
                background:"rgba(0, 0, 0, 0.6)",
                target: document.querySelector('.container_outer')
            });
            this.getData();
            loading.close();
        },

        getData(){
            this.$i18n.locale = this.$route.params.lang;
            publicService.get_standing_game(this.$route.params.competition)
            .then(res => { 
                if(res.code==1){
                    this.ranks = res.standing;
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
.standing{
    position:relative;
    width:96%;
    padding-top:11.1%;
    margin-bottom:-1vmin;
    margin-left:2%;
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