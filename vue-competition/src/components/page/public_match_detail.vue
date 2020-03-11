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
            <div style="margin-bottom:1vmin;">
                <div style="height:100%;position:relative;">
                    <img width="100%" src="image/league/title/detail_win.png">
                </div>
            </div>
            <div v-for='(row, index) in details' :class="`detail_${index}`" class="detail" v-if="details!=[]">
                <div style="position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding-top:4%;
                background-size:100%;background-repeat:no-repeat;background-image:url('image/league/detail/rows.png');background-position:center;">
                    <div class="t0l0 wfhf" style="position:absolute;">
                        <div style="float:left;width:2.3%;height:100%;display:flex;align-items:center;justify-content:center;"> </div>
                        <div style="float:left;width:0.7%;height:100%;display:flex;align-items:center;justify-content:right;
                        background-size:60%;background-repeat:no-repeat;background-image:url('image/league/detail/date_title.png');background-position:center;"></div>
                        <div style="margin-bottom:1vmin;font-size:2.5vmin;float:left;width:97%;height:100%;display:flex;align-items:center;justify-content:left;" class="Num_font">
                            <span style="margin-left:1.5%;">{{row.year}} / {{row.month}} / {{row.day}}</span>
                            <span style="margin-left:5%;">{{row.start_time}}</span>
                        </div>
                    </div>
                </div>
                <div class="wfhf" style="position:relative;">
                    <div class="t0l0 wfhf" style="position:relative;">
                        <div class="team-lowpanel" style="background-image:url('image/league/detail/BlueTeam.png');"></div>
                        <div class="team-lowpanel" style="background-image:url('image/league/detail/RedTeam.png');"></div>
                        <div class="t0l0 wfhf" style="position:absolute;">
                            <div v-if="row.home.win==1" class="team-win-lose" style="width:47%;background-image:url('image/league/detail/win.png');background-position:right;margin-top:0.7%;"></div>
                            <div v-else class="team-win-lose" style="width:47%;background-image:url('image/league/detail/lose.png');background-position:right;margin-top:0.7%;"></div>
                            <div class="team-win-lose" style="width:6%;"></div>
                            <div v-if="row.away.win==1" class="team-win-lose" style="width:47%;background-image:url('image/league/detail/win.png');background-position:left;margin-top:0.7%;"></div>
                            <div v-else class="team-win-lose" style="width:47%;height:100%;background-image:url('image/league/detail/lose.png');background-position:left;margin-top:0.7%;"></div>
                        </div>
                        <div class="t0l0 wfhf" style="position:absolute;top:-0.7vmin;">
                            <div class="team-win-lose" style="width:47%;">
                                <div class="text-center"><p class="column_font colfont-team">{{row.home.team_name}}</p><p class="Num_font numfont-team">{{row.home.gate_hp}}</p></div>
                            </div>
                            <div class="team-win-lose text-center" style="width:6%;"></div>
                            <div class="team-win-lose text-center" style="width:47%;">
                                <div class="text-center"><p class="column_font colfont-team">{{row.away.team_name}}</p><p class="Num_font numfont-team">{{row.away.gate_hp}}</p></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="t0l0 wfhf" style="position:relative;">
                    <div class="t0l0 wfhf column_font" style="position:absolute;margin-top:8%;color:white;">
                        <div class="team-win-lose" style="width:47%;background-image:url('image/league/detail/item_col.png');background-position:center;"></div>
                        <div class="team-win-lose" style="width:3%;"></div>
                        <div class="team-win-lose" style="width:3%;"></div>
                        <div class="team-win-lose" style="width:47%;background-image:url('image/league/detail/item_col.png');background-position:center"></div>
                        <div class="t0l0 wfhf" style="position:absolute;margin-top:-2.1%;font-size:1.7vmin;">
                            <div class="team-win-lose" style="width:7%;"></div>
                            <div class="team-win-lose" style="width:12%;"></div>
                            <div class="team-win-lose" style="width:7%;">{{$t('game_info.league.kill')}}</div>
                            <div class="team-win-lose" style="width:7%;">{{$t('game_info.league.headshot')}}</div>
                            <div class="team-win-lose" style="width:7%;">{{$t('game_info.league.death')}}</div>
                            <div class="team-win-lose" style="width:7%;">{{$t('game_info.league.fortress')}}</div>
                            <div class="team-win-lose" style="width:7%;"></div>
                            <div class="team-win-lose" style="width:12%;"></div>
                            <div class="team-win-lose" style="width:7%;">{{$t('game_info.league.kill')}}</div>
                            <div class="team-win-lose" style="width:7%;">{{$t('game_info.league.headshot')}}</div>
                            <div class="team-win-lose" style="width:7%;">{{$t('game_info.league.death')}}</div>
                            <div class="team-win-lose" style="width:7%;">{{$t('game_info.league.fortress')}}</div>
                        </div>
                    </div>
                </div>
                <div v-for='(row_rc, index_rc) in row.home.records' :class="firstrow(index_rc)" style="width:100%;margin-left:-3%;margin-top:1.5%;color:white;" class="records-all row-record Num_font">
                    <div class="records-name column_font" style="width:18%;">
                        <span class="records" v-if="row.home.records[index_rc].mvp==1"><img width="70%" src="image/league/detail/mvp.png"></span>
                        <span style="width:auto;word-break:break-all;" class="nickname-size" :class="mvpclass(row.home.records[index_rc].mvp)">{{row.home.records[index_rc].nickname}}</span>
                    </div>
                    <div class="records column_font" style="width:1%;"></div>
                    <div class="records" style="width:7%;">
                        <span :class="mvpclass(row.home.records[index_rc].mvp)">{{row.home.records[index_rc].kills}}</span>
                    </div>
                    <div class="records" style="width:7%;">
                        <span :class="mvpclass(row.home.records[index_rc].mvp)">{{row.home.records[index_rc].headshots}}</span>
                    </div>
                    <div class="records" style="width:7%;">
                        <span :class="mvpclass(row.home.records[index_rc].mvp)">{{row.home.records[index_rc].death}}</span>
                    </div>
                    <div class="records" style="width:7%;">
                        <span :class="mvpclass(row.home.records[index_rc].mvp)">{{row.home.records[index_rc].gate}}</span>
                    </div>
                    <div class="records-name column_font" style="width:18%;">
                        <span class="records" v-if="row.away.records[index_rc].mvp==1"><img width="70%" src="image/league/detail/mvp.png"></span>
                        <span style="width:auto;word-break:break-all;" class="nickname-size" :class="mvpclass(row.away.records[index_rc].mvp)">{{row.away.records[index_rc].nickname}}</span>
                    </div>
                    <div class="records column_font" style="width:1%;"></div>
                    <div class="records" style="width:7%;">
                        <span :class="mvpclass(row.away.records[index_rc].mvp)">{{row.away.records[index_rc].kills}}</span>
                    </div>
                    <div class="records" style="width:7%;">
                        <span :class="mvpclass(row.away.records[index_rc].mvp)">{{row.away.records[index_rc].headshots}}</span>
                    </div>
                    <div class="records" style="width:7%;">
                        <span :class="mvpclass(row.away.records[index_rc].mvp)">{{row.away.records[index_rc].death}}</span>
                    </div>
                    <div class="records" style="width:7%;">
                        <span :class="mvpclass(row.away.records[index_rc].mvp)">{{row.away.records[index_rc].gate}}</span>
                    </div>
                </div>
                <img v-if="index!=(hr_check-1)" style="margin:2% 10%;" width="80%" src="image/league/detail/hr_line.png">
                <img v-if="index==(hr_check-1)" style="margin:4% 10%;opacity:0;" width="80%" src="image/league/detail/hr_line.png">
            </div>
        </div>
        </el-scrollbar>
    </div>
</template>
<script>
import {publicService} from "@/_services";
export default {
    name:"public_matches_detail",
    components: {

    },

    data(){
        return{
            // details:[],
            // hr_check:null,
            // angle:null,
            hr_check:2,
            details:[
                {
                    "year":"2020",
                    "month":"03",
                    "day":"16",
                    "start_time":"14:30",
                    "home":{
                        "win":1,
                        "gate_hp":"96.80%",
                        "team_name":"Queen Guards",
                        "records":[
                            {"nickname":"init函數","kills":6,"headshots":5,"death":4,"gate":0,"mvp":0},
                            {"nickname":"冰與火之歌","kills":12,"headshots":10,"death":3,"gate":1.2,"mvp":1},
                            {"nickname":"上官中二","kills":2,"headshots":2,"death":2,"gate":0.3,"mvp":0},
                            {"nickname":"R9487","kills":5,"headshots":1,"death":7,"gate":0.8,"mvp":0},
                        ]
                    },
                    "away":{
                        "win":0,
                        "gate_hp":"36.50%",
                        "team_name":"Baaaaad Boys",
                        "records":[
                            {"nickname":"wwwwwwwwwww","kills":2,"headshots":5,"death":6,"gate":0,"mvp":0},
                            {"nickname":"帥帥的路人甲","kills":7,"headshots":3,"death":9,"gate":0,"mvp":0},
                            {"nickname":"一天轉大人","kills":2,"headshots":2,"death":2,"gate":0,"mvp":0},
                            {"nickname":"戰現實","kills":4,"headshots":1,"death":9,"gate":0.8,"mvp":0},
                        ]
                    }
                },
                {
                    "year":"2020",
                    "month":"03",
                    "day":"16",
                    "start_time":"14:43",
                    "home":{
                        "win":0,
                        "gate_hp":"60.20%",
                        "team_name":"女王戰隊",
                        "records":[
                            {"nickname":"init函數","kills":6,"headshots":5,"death":4,"gate":0,"mvp":0},
                            {"nickname":"冰與火之歌","kills":5,"headshots":1,"death":4,"gate":0,"mvp":0},
                            {"nickname":"上官中二","kills":2,"headshots":2,"death":2,"gate":0.3,"mvp":0},
                            {"nickname":"R9487","kills":5,"headshots":1,"death":7,"gate":0.2,"mvp":0},
                        ]
                    },
                    "away":{
                        "win":1,
                        "gate_hp":"88.30%",
                        "team_name":"壞小子",
                        "records":[
                            {"nickname":"wwwwwwwwwww","kills":2,"headshots":5,"death":6,"gate":0,"mvp":0},
                            {"nickname":"帥帥的路人甲","kills":11,"headshots":7,"death":4,"gate":1.2,"mvp":1},
                            {"nickname":"一天轉大人","kills":2,"headshots":2,"death":2,"gate":0,"mvp":0},
                            {"nickname":"戰現實","kills":4,"headshots":1,"death":9,"gate":0.8,"mvp":0},
                        ]
                    }
                },
            ]
        }
    },

    created(){
        this.getData();
    },

    // mounted(){
    //     this.$nextTick(()=>{
    //         window.addEventListener('resize', this.getAngle);
    //         this.getAngle();
    //     })
    // },

    // beforeDestroy(){
    //     window.removeEventListener('resize', this.getAngle);
    // },

    computed:{
        
    },

    watch:{
        '$route.params.competition':{
            handler(newval, oldval){
                this.getData();
            },
        },
        '$route.params.main_team':{
            handler(newval, oldval){
                this.getData();
            },
        },
        '$route.params.lang':{
            handler(newval, oldval){
                this.getData();
            },
        },
        // angle(){
        //     var clientWidth=document.documentElement.clientWidth;
        //     var clientHeight=document.documentElement.clientHeight;
        //     Object.defineProperty(document.documentElement, 'clientHeight', {
        //         value: clientWidth,
        //         writable: true
        //     });
        //     Object.defineProperty(document.documentElement, 'clientWidth', {
        //         value: clientHeight,
        //         writable: true
        //     });
        //     this.getData();
        // },
        // 'window.screen.orientation.angle':{
        //     handler(newval, oldval){
        //         this.getData()
        //     },
        // },
    },

    methods:{
        // getAngle(event){
        //     this.angle = window.screen.orientation.angle;
        //     console.log(this.angle)
        // },
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
         
        mvpclass(mvp){
            if(mvp==1){
                return "mvp-class"
            }
        },

        firstrow(index){
            if(index==0){
                return "first-row"
            }
        },

        getData(){
            this.$i18n.locale = this.$route.params.lang;
            publicService.get_match_game(this.$route.params.competition, this.$route.params.main_team)
            .then(res => { 
            //    if(res.code==1){
            //         this.details=res.details;
            //         this.hr_check=res.details.length;
            //     }                
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
.text-center{
    text-align:center;
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
.detail{
    position:relative;
    width:90%;
    margin-left:5%;
}
.first-row{
    margin-top:2.5%!important;
}
.mvp-class{
    color:#E3DB70!important;
}
.records{
    float:left;
    position:relative;
    height:100%;
    display:flex;
    align-items:center;
    justify-content:center;
    background-size:contain;
    background-repeat:no-repeat;
}
.records-name{
    float:left;
    position:relative;
    height:100%;
    display:flex;
    align-items:center;
    justify-content:flex-end;
}
.records-all{
    float:left;
    position:relative;
    height:100%;
    display:flex;
    align-items:center;
    justify-content:center;
    background-size:contain;
    background-repeat:no-repeat;
    background-image:linear-gradient(to right, transparent, rgba(0,0,0,0.3), transparent);
}
.team-win-lose{
    float:left;
    position:relative;
    height:100%;
    display:flex;
    align-items:center;
    justify-content:center;
    padding-top:4%;
    margin-top:0.3%;
    background-size:contain;
    background-repeat:no-repeat;
}
.team-lowpanel{
    float:left;
    width:50%;
    height:100%;
    display:flex;
    align-items:center;
    justify-content:right;
    padding-top:11.5%;
    margin-top:-1.1vmin;
    background-size:100%;
    background-repeat:no-repeat;
    background-position:center;
}
.t0l0{
    top:0;
    left:0;
}
.wfhf{
    width:100%;
    height:100%;
}
.colfont-team{
    font-size:3vmin;
}
.numfont-team{
    font-size:2.5vmin;
}
.row-record{
    font-size:2.5vmin;
}
.nickname-size{
    font-size:1.8vmin;
}
@media(max-width:1024px){
.colfont-team{
    font-size:2.5vmin;
}
.numfont-team{
    font-size:2.0vmin;
}
.nickname-size{
    font-size:1.6vmin;
}
}
@media(max-width:500px){
.colfont-team{
    font-size:2.0vmin;
}
.numfont-team{
    font-size:1.5vmin;
}
.nickname-size{
    font-size:1.4vmin;
}
}
@media screen and (max-width:1024px) and (orientation:landscape){
.colfont-team{
    font-size:5vmin;
}
.numfont-team{
    font-size:4vmin;
}
.nickname-size{
    font-size:2vmin;
}
}
</style>